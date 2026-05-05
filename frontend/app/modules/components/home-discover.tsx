"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import type { CategorySummary, MarketplacePrompt, PromptListResponse } from "@/lib/types";

type HomeDiscoverProps = {
  categories: CategorySummary[];
  initialPrompts: MarketplacePrompt[];
};

export function HomeDiscover({
  categories,
  initialPrompts,
}: HomeDiscoverProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [prompts, setPrompts] = useState<MarketplacePrompt[]>(initialPrompts);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCategorySelect(categoryName: string) {
    if (categoryName === selectedCategory) {
      return;
    }

    setSelectedCategory(categoryName);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const query =
        categoryName === "All"
          ? "/prompts?limit=4&sortBy=ranking"
          : `/prompts?limit=4&sortBy=ranking&category=${encodeURIComponent(categoryName)}`;
      const response = await apiFetch<PromptListResponse>(query, {
        includeAuth: false,
      });
      setPrompts(response.prompts);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to load this category right now."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const discoverCategories = [
    {
      name: "All",
      slug: "all",
      promptCount: initialPrompts.length,
      averageAiScore: 0,
      averageRating: 0,
    },
    ...categories,
  ];

  const viewMoreHref =
    selectedCategory === "All"
      ? "/browse"
      : `/browse?category=${encodeURIComponent(selectedCategory)}`;

  return (
    <section className="mb-10 rounded-[2rem] border border-border/50 bg-card/35 p-6 lg:p-8">
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex min-w-max gap-3">
          {discoverCategories.map((category) => {
            const isActive = category.name === selectedCategory;

            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => void handleCategorySelect(category.name)}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "border-white/10 bg-gradient-to-r from-zinc-200 via-zinc-500 to-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                    : "border-black/10 bg-black text-white hover:bg-black/90",
                ].join(" ")}
              >
                <Tag className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discover</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing a few ranked prompts for{" "}
            <span className="font-medium text-foreground">{selectedCategory}</span>.
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-full px-5">
          <Link href={viewMoreHref}>
            View more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-background/40 p-6 text-sm text-muted-foreground">
          Loading prompts for {selectedCategory}...
        </div>
      ) : prompts.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt._id}
              prompt={prompt}
              accessLabel={selectedCategory === "All" ? "Discover" : selectedCategory}
              accessTone="free"
              className="border-border/50 bg-background/35"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-background/40 p-6 text-sm text-muted-foreground">
          No prompts are available for this category yet.
        </div>
      )}
    </section>
  );
}
