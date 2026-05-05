"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Flame, Heart, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch, ApiError } from "@/lib/api";
import {
  calculatePromptEngagement,
  isPromptLiked,
  isPromptSaved,
  toggleStoredPromptLike,
  toggleStoredPromptSave,
  type Prompt,
} from "@/lib/prompts";
import type { MarketplacePrompt } from "@/lib/types";

type PromptCardData =
  | Prompt
  | (Omit<MarketplacePrompt, "author"> & {
      author: MarketplacePrompt["author"];
    });

type PromptCardProps = {
  prompt: PromptCardData;
  accessLabel?: string;
  accessTone?: "free" | "premium";
  ctaLabel?: string;
  className?: string;
  showExcerpt?: boolean;
  onLikeChange?: (slug: string, liked: boolean) => void;
  onSaveChange?: (slug: string, saved: boolean) => void;
};

function getPromptIdentifier(prompt: PromptCardData) {
  if ("_id" in prompt && typeof prompt._id === "string") {
    return prompt._id;
  }

  return null;
}

function getPromptRating(prompt: PromptCardData) {
  return "ratingAverage" in prompt ? prompt.ratingAverage : prompt.rating;
}

function getPromptSales(prompt: PromptCardData) {
  return "views" in prompt ? prompt.views : prompt.sales;
}

function getPromptLikes(prompt: PromptCardData) {
  return "likeCount" in prompt ? prompt.likeCount : prompt.likes;
}

function getPromptCreator(prompt: PromptCardData) {
  if ("author" in prompt && typeof prompt.author === "object") {
    return prompt.author.name;
  }

  return "creator" in prompt ? prompt.creator : "Unknown";
}

function getPromptAccess(prompt: PromptCardData) {
  return "access" in prompt ? prompt.access : "free";
}

function getPromptExcerpt(prompt: PromptCardData) {
  return "excerpt" in prompt ? prompt.excerpt : prompt.evaluationSummary;
}

function getPromptEngagement(prompt: PromptCardData, likes: number) {
  if ("engagementScore" in prompt) {
    const likeDelta = likes - prompt.likeCount;
    return Math.max(0, Math.round(prompt.engagementScore + likeDelta * 4));
  }

  return Math.round(
    calculatePromptEngagement({
      ...prompt,
      likes,
    })
  );
}

export function PromptCard({
  prompt,
  accessLabel,
  accessTone = "free",
  ctaLabel = "View details",
  className,
  showExcerpt = false,
  onLikeChange,
  onSaveChange,
}: PromptCardProps) {
  const router = useRouter();
  const promptId = getPromptIdentifier(prompt);
  const [liked, setLiked] = useState("isLiked" in prompt ? Boolean(prompt.isLiked) : false);
  const [saved, setSaved] = useState(
    "isFavorited" in prompt ? Boolean(prompt.isFavorited) : false
  );
  const [likes, setLikes] = useState(getPromptLikes(prompt));
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const storedLiked = isPromptLiked(prompt.slug);
    const storedSaved = isPromptSaved(prompt.slug);

    if (promptId) {
      const initialLiked =
        ("isLiked" in prompt ? Boolean(prompt.isLiked) : false) || storedLiked;
      setLiked(initialLiked);
      setSaved(
        ("isFavorited" in prompt ? Boolean(prompt.isFavorited) : false) ||
          storedSaved
      );
      setLikes(getPromptLikes(prompt) + (storedLiked ? 1 : 0));
      setActionMessage("");
      return;
    }

    setLiked(storedLiked);
    setSaved(storedSaved);
    setLikes(getPromptLikes(prompt) + (storedLiked ? 1 : 0));
  }, [prompt, promptId]);

  function openPrompt() {
    router.push(`/browse/${prompt.slug}`);
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPrompt();
    }
  }

  async function handleToggleLike(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!promptId) {
      const nextLiked = toggleStoredPromptLike(prompt.slug);
      setLiked(nextLiked);
      setLikes((current) => current + (nextLiked ? 1 : -1));
      onLikeChange?.(prompt.slug, nextLiked);
      return;
    }

    try {
      const nextLiked = !liked;
      await apiFetch<{ prompt: MarketplacePrompt }>(
        `/prompts/${promptId}/like`,
        { method: nextLiked ? "POST" : "DELETE" }
      );
      if (isPromptLiked(prompt.slug) !== nextLiked) {
        toggleStoredPromptLike(prompt.slug);
      }
      setLiked(nextLiked);
      setLikes((current) => current + (nextLiked ? 1 : -1));
      setActionMessage("");
      onLikeChange?.(prompt.slug, nextLiked);
    } catch (error) {
      const nextLiked = toggleStoredPromptLike(prompt.slug);
      setLiked(nextLiked);
      setLikes((current) => current + (nextLiked ? 1 : -1));
      setActionMessage(
        error instanceof ApiError && error.statusCode === 401
          ? "Saved locally. Sign in to sync likes."
          : "Saved locally while the server is unavailable."
      );
      onLikeChange?.(prompt.slug, nextLiked);
    }
  }

  async function handleToggleSave(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!promptId) {
      const nextSaved = toggleStoredPromptSave(prompt.slug);
      setSaved(nextSaved);
      onSaveChange?.(prompt.slug, nextSaved);
      return;
    }

    try {
      const nextSaved = !saved;
      await apiFetch<{ prompt: MarketplacePrompt }>(
        `/prompts/${promptId}/favorite`,
        { method: nextSaved ? "POST" : "DELETE" }
      );
      if (isPromptSaved(prompt.slug) !== nextSaved) {
        toggleStoredPromptSave(prompt.slug);
      }
      setSaved(nextSaved);
      setActionMessage("");
      onSaveChange?.(prompt.slug, nextSaved);
    } catch (error) {
      const nextSaved = toggleStoredPromptSave(prompt.slug);
      setSaved(nextSaved);
      setActionMessage(
        error instanceof ApiError && error.statusCode === 401
          ? "Saved locally. Sign in to sync saved prompts."
          : "Saved locally while the server is unavailable."
      );
      onSaveChange?.(prompt.slug, nextSaved);
    }
  }

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={openPrompt}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open ${prompt.title}`}
      className={`flex h-full cursor-pointer flex-col transition-colors hover:border-primary/40 ${className ?? ""}`}
    >
      <CardHeader className="space-y-2 p-3 pb-1.5 lg:p-3 lg:pb-1.5">
        <div className="flex items-start justify-between gap-3">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            {prompt.category}
          </Badge>
          {accessLabel ? (
            <Badge
              variant="outline"
              className={
                accessTone === "premium"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }
            >
              {accessLabel}
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{getPromptRating(prompt)}</span>
          </div>
        </div>
        <CardTitle
          className="min-h-[2.6rem] text-lg leading-5 lg:min-h-[2.6rem] lg:text-[1.05rem]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {prompt.title}
        </CardTitle>
        <CardDescription
          className="min-h-[2.35rem] text-xs leading-4.5"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {prompt.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 p-3 pt-0 lg:p-3 lg:pt-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{getPromptSales(prompt)} views</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current text-primary" : ""}`} />
            {likes} likes
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5" />
            {getPromptEngagement(prompt, likes)} engagement
          </span>
        </div>

        {showExcerpt ? (
          <p
            className="min-h-[2.2rem] text-xs leading-4.5 text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {getPromptExcerpt(prompt)}
          </p>
        ) : (
          <p
            className="min-h-5 text-xs text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            by {getPromptCreator(prompt)}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-1.5 pt-0.5">
          <Button
            variant={liked ? "default" : "outline"}
            size="icon-sm"
            onClick={handleToggleLike}
            className="h-8 w-8 px-0"
            aria-label={liked ? "Unlike prompt" : "Like prompt"}
          >
            <Heart className={liked ? "fill-current" : ""} />
          </Button>
          <Button
            variant={saved ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleSave}
            className="h-8 px-2.5 text-xs"
          >
            <Bookmark className={saved ? "fill-current" : ""} />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>

        {actionMessage ? (
          <p className="text-[11px] text-amber-300">{actionMessage}</p>
        ) : null}
      </CardContent>

      <CardFooter className="flex items-center justify-between p-3 pt-0 lg:p-3 lg:pt-0">
        <span className="text-[11px] text-muted-foreground sm:text-xs">
          {saved
            ? "Saved for later"
            : getPromptAccess(prompt) === "premium"
              ? "Premium access"
              : "Free access"}
        </span>
        <span className="text-xs font-medium text-primary">{ctaLabel}</span>
      </CardFooter>
    </Card>
  );
}
