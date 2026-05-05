"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bookmark,
  Heart,
  Mail,
  PenSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/app/modules/components/navbar";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, ApiError } from "@/lib/api";
import { getStoredUser, setStoredUser } from "@/lib/session";
import type { WorkspaceResponse } from "@/lib/types";

type WorkspaceState = WorkspaceResponse | null;

const activityLabels: Record<string, string> = {
  view: "Viewed",
  create: "Created",
  review: "Reviewed",
  favorite: "Saved",
  like: "Liked",
};

export default function ProfilePage() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const localUser = getStoredUser();

    if (!localUser) {
      router.push("/auth");
      return;
    }

    async function loadWorkspace() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await apiFetch<WorkspaceResponse>("/users/me/workspace?limit=6");
        setWorkspace(response);

        if (localUser && (response.user.id || response.user._id)) {
          setStoredUser({
            id: response.user.id || response.user._id || localUser.id,
            name: response.user.name,
            email: response.user.email || localUser.email,
            role: response.user.role,
            bio: response.user.bio,
            avatarUrl: response.user.avatarUrl,
            favoriteTags: response.user.favoriteTags,
          });
        }
      } catch (error) {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : "Unable to load your workspace right now."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadWorkspace();
  }, [router]);

  const initials = useMemo(() => {
    const name = workspace?.user?.name || getStoredUser()?.name || "PromptX";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [workspace]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pb-16 pt-24 text-sm text-muted-foreground">
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pb-16 pt-24">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-sm text-muted-foreground">
            {errorMessage || "Unable to load your workspace."}
          </div>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      label: "Published Prompts",
      value: workspace.metrics.publishedPromptCount,
      icon: PenSquare,
    },
    {
      label: "Saved Prompts",
      value: workspace.metrics.savedCount,
      icon: Bookmark,
    },
    {
      label: "Liked Prompts",
      value: workspace.metrics.likedCount,
      icon: Heart,
    },
    {
      label: "Total Views",
      value: workspace.metrics.totalViews,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <section className="mb-8 rounded-[2rem] border border-border/50 bg-card/50 p-6 lg:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge className="border-primary/30 bg-primary/15 text-primary">
              Workspace
            </Badge>
            <Badge variant="outline">{workspace.user.role}</Badge>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-border/50 bg-primary/15 text-2xl font-semibold text-primary">
                {initials}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{workspace.user.name}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {workspace.user.email}
              </p>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground">
                {workspace.user.bio || "Your live PromptX workspace for authored prompts, saves, likes, and activity."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(workspace.user.favoriteTags || []).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild className="bg-gradient-to-r from-primary to-tertiary hover:opacity-90">
                <Link href="/upload">Upload Prompt</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/browse">Browse Feed</Link>
              </Button>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            {errorMessage}
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} className="border-border/50 bg-card/40">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{card.label}</span>
                    <div className="rounded-xl border border-border/50 bg-background/60 p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight">{card.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/40">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Published Prompts</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/upload">Create Another</Link>
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {workspace.authoredPrompts.length ? (
                  workspace.authoredPrompts.map((prompt) => (
                    <PromptCard
                      key={prompt._id}
                      prompt={prompt}
                      accessLabel="Authored"
                      accessTone="free"
                      className="border-border/50 bg-background/40"
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground md:col-span-2">
                    No published prompts yet. Your next submission will flow through evaluation and ranking automatically.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle>Saved Prompts</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {workspace.savedPrompts.length ? (
                  workspace.savedPrompts.map((prompt) => (
                    <PromptCard
                      key={prompt._id}
                      prompt={prompt}
                      accessLabel="Saved"
                      accessTone="free"
                      className="border-border/50 bg-background/40"
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground md:col-span-2">
                    You have not saved any prompts yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle>Liked Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workspace.likedPrompts.length ? (
                  workspace.likedPrompts.map((prompt) => (
                    <Link
                      key={prompt._id}
                      href={`/browse/${prompt.slug}`}
                      className="block rounded-2xl border border-border/50 bg-background/40 p-4 transition-colors hover:border-primary/40"
                    >
                      <p className="font-medium">{prompt.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {prompt.category} • {prompt.likeCount} likes
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You have not liked any prompts yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workspace.recentActivity.length ? (
                  workspace.recentActivity.map((activity) => (
                    <div
                      key={activity._id}
                      className="rounded-2xl border border-border/50 bg-background/40 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4 text-primary" />
                        {activityLabels[activity.type] || activity.type}
                      </div>
                      <p className="font-medium">{activity.prompt.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your activity feed will populate as you browse, save, like, and review prompts.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle>Workspace Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/40 p-4">
                  <span className="text-sm">Reviews written</span>
                  <Badge variant="outline">{workspace.metrics.reviewsWrittenCount}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/40 p-4">
                  <span className="text-sm">Reviews received</span>
                  <Badge variant="outline">{workspace.metrics.reviewsReceivedCount}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/40 p-4">
                  <span className="text-sm">Average ranking score</span>
                  <Badge className="bg-primary/15 text-primary">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    {workspace.metrics.averageRankingScore}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
