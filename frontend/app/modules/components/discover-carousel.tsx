"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import { freePrompts, rankPromptsByEngagement, type Prompt } from "@/lib/prompts";
import type { CategorySummary, MarketplacePrompt, PromptListResponse } from "@/lib/types";

type DiscoverCarouselProps = {
  categories: CategorySummary[];
  initialPrompts: Array<MarketplacePrompt | Prompt>;
};

export function DiscoverCarousel({
  categories,
  initialPrompts,
}: DiscoverCarouselProps) {
  const tagRailRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [prompts, setPrompts] = useState(initialPrompts);
  const [sortBy, setSortBy] = useState("likeCount");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const discoverCategories = useMemo(
    () => [
      {
        name: "All",
        slug: "all",
        promptCount: initialPrompts.length,
        averageAiScore: 0,
        averageRating: 0,
      },
      ...categories,
    ],
    [categories, initialPrompts.length]
  );

  const tagLoop = useMemo(
    () => [...discoverCategories, ...discoverCategories],
    [discoverCategories]
  );

  useEffect(() => {
    const rail = tagRailRef.current;

    if (!rail) {
      return;
    }

    let frameId = 0;
    let paused = false;

    const tick = () => {
      if (!paused) {
        rail.scrollLeft += 0.55;

        if (rail.scrollLeft >= rail.scrollWidth / 2) {
          rail.scrollLeft = 0;
        }
      }

      frameId = window.requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
    };

    const resume = () => {
      paused = false;
    };

    rail.addEventListener("mouseenter", pause);
    rail.addEventListener("mouseleave", resume);
    rail.addEventListener("touchstart", pause, { passive: true });
    rail.addEventListener("touchend", resume, { passive: true });

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      rail.removeEventListener("mouseenter", pause);
      rail.removeEventListener("mouseleave", resume);
      rail.removeEventListener("touchstart", pause);
      rail.removeEventListener("touchend", resume);
    };
  }, [tagLoop]);

  function getApiSort(sortKey: string) {
    switch (sortKey) {
      case "newest":
        return "newest";
      case "rating":
        return "rating";
      case "views":
        return "views";
      default:
        return "ranking";
    }
  }

  function getFallbackPrompts(categoryName: string, sortKey: string) {
    const scopedPrompts =
      categoryName === "All"
        ? freePrompts
        : freePrompts.filter((prompt) => prompt.category === categoryName);

    const ranked = rankPromptsByEngagement(scopedPrompts);

    if (sortKey === "rating") {
      return [...ranked].sort((left, right) => right.rating - left.rating).slice(0, 8);
    }

    if (sortKey === "views") {
      return [...ranked].sort((left, right) => right.sales - left.sales).slice(0, 8);
    }

    return ranked.slice(0, 8);
  }

  async function loadPrompts(categoryName: string, sortKey: string) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const sortByParam = getApiSort(sortKey);
      const query =
        categoryName === "All"
          ? `/prompts?limit=8&sortBy=${sortByParam}`
          : `/prompts?limit=8&sortBy=${sortByParam}&category=${encodeURIComponent(categoryName)}`;
      const response = await apiFetch<PromptListResponse>(query, {
        includeAuth: false,
      });

      setPrompts(
        response.prompts.length
          ? response.prompts
          : getFallbackPrompts(categoryName, sortKey)
      );
    } catch (error) {
      setPrompts(getFallbackPrompts(categoryName, sortKey));
      setErrorMessage(
        error instanceof ApiError
          ? `${error.message}. Showing curated local picks instead.`
          : "Showing curated local picks while live prompts are unavailable."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCategorySelect(categoryName: string) {
    if (categoryName === selectedCategory) {
      return;
    }

    setSelectedCategory(categoryName);
    await loadPrompts(categoryName, sortBy);
  }

  async function handleSortChange(nextSort: string) {
    setSortBy(nextSort);
    await loadPrompts(selectedCategory, nextSort);
  }

  const viewMoreHref =
    selectedCategory === "All"
      ? `/browse?sortBy=${encodeURIComponent(getApiSort(sortBy))}`
      : `/browse?category=${encodeURIComponent(selectedCategory)}&sortBy=${encodeURIComponent(getApiSort(sortBy))}`;

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="container mx-auto px-4">
        <div className="relative mb-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

          <div
            ref={tagRailRef}
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max gap-4 px-10 py-2">
              {tagLoop.map((category, index) => {
                const isActive = category.name === selectedCategory;

                return (
                  <button
                    key={`${category.slug}-${index}`}
                    type="button"
                    onClick={() => void handleCategorySelect(category.name)}
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300",
                      isActive
                        ? "border-white/15 bg-[linear-gradient(90deg,#d4d4d8_0%,#7a7a7a_20%,#0a0a0a_100%)] text-white shadow-[0_14px_32px_rgba(0,0,0,0.22)]"
                        : "border-black/10 bg-black text-white hover:bg-zinc-900",
                    ].join(" ")}
                  >
                    <Tag className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-border/50 pb-5">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Discover</h2>
            {selectedCategory !== "All" ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white">
                <Tag className="h-4 w-4" />
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => void handleCategorySelect("All")}
                  className="text-white/90 transition-colors hover:text-white"
                  aria-label="Clear selected category"
                >
                  x
                </button>
              </div>
            ) : null}
          </div>

          <label className="inline-flex items-center">
            <span className="sr-only">Sort prompts</span>
            <select
              value={sortBy}
              onChange={(event) => void handleSortChange(event.target.value)}
              className="rounded-full border border-zinc-300 bg-white px-6 py-4 text-lg font-medium text-black outline-none transition-colors focus:border-black"
            >
              <option value="likeCount">Most liked</option>
              <option value="newest">New</option>
              <option value="rating">Top rated</option>
              <option value="views">Most viewed</option>
            </select>
          </label>
        </div>

        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-3xl border border-border/50 bg-card/40 p-6 text-sm text-muted-foreground">
            Loading prompts for {selectedCategory}...
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {prompts.map((prompt) => (
              <PromptCard
                key={"_id" in prompt ? prompt._id : prompt.id}
                prompt={prompt}
                accessLabel={selectedCategory === "All" ? "Discover" : selectedCategory}
                accessTone="free"
                className="h-full rounded-[2rem] border-border/50 bg-card/65 shadow-[0_18px_45px_rgba(15,23,42,0.1)] backdrop-blur-sm"
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href={viewMoreHref}>
              View more from {selectedCategory}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
