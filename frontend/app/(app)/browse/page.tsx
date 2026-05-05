"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/modules/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { apiFetch, ApiError } from "@/lib/api";
import type {
  CategoryListResponse,
  MarketplacePrompt,
  PromptListResponse,
} from "@/lib/types";
import {
  freePrompts,
  hydratePromptLikes,
  rankPromptsByEngagement,
  type Prompt,
} from "@/lib/prompts";

type FilterChangeDetail = {
  category?: string;
  search?: string;
};

export default function BrowserPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [prompts, setPrompts] = useState<Array<MarketplacePrompt | Prompt>>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const hasLoadedPrompts = useRef(false);

  useEffect(() => {
    function syncFiltersFromUrl() {
      const params = new URLSearchParams(window.location.search);
      setSelectedCategory(params.get("category") || "All");
      setSearchQuery(params.get("search") || "");
    }

    function syncFiltersFromEvent(event: Event) {
      const detail =
        event instanceof CustomEvent
          ? (event.detail as FilterChangeDetail | undefined)
          : undefined;

      if (detail) {
        setSelectedCategory(detail.category || "All");
        setSearchQuery(detail.search || "");
        return;
      }

      syncFiltersFromUrl();
    }

    syncFiltersFromUrl();
    window.addEventListener("popstate", syncFiltersFromUrl);
    window.addEventListener("promptx:filters-changed", syncFiltersFromEvent);

    return () => {
      window.removeEventListener("popstate", syncFiltersFromUrl);
      window.removeEventListener("promptx:filters-changed", syncFiltersFromEvent);
    };
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await apiFetch<CategoryListResponse>(
          "/categories?limit=100"
        );
        setCategoryOptions([
          "All",
          ...response.categories.map((category) => category.name),
        ]);
      } catch {
        setCategoryOptions([
          "All",
          ...Array.from(new Set(freePrompts.map((prompt) => prompt.category))),
        ]);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    function getFallbackPrompts() {
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const scopedPrompts =
        selectedCategory === "All"
          ? freePrompts
          : freePrompts.filter((prompt) => prompt.category === selectedCategory);

      const filteredPrompts = normalizedSearch
        ? scopedPrompts.filter((prompt) =>
            [prompt.title, prompt.description, prompt.category, prompt.creator]
              .join(" ")
              .toLowerCase()
              .includes(normalizedSearch)
          )
        : scopedPrompts;

      return rankPromptsByEngagement(hydratePromptLikes(filteredPrompts)).slice(0, 40);
    }

    async function loadPrompts() {
      const isInitialLoad = !hasLoadedPrompts.current;

      try {
        setIsLoading(isInitialLoad);
        setIsRefreshing(!isInitialLoad);
        setErrorMessage("");
        const queryParams = new URLSearchParams({
          limit: "40",
          sortBy: "ranking",
        });
        if (selectedCategory !== "All") {
          queryParams.set("category", selectedCategory);
        }
        if (searchQuery.trim()) {
          queryParams.set("search", searchQuery.trim());
        }
        const query = `/prompts?${queryParams.toString()}`;
        const response = await apiFetch<PromptListResponse>(query);
        if (response.prompts.length) {
          setPrompts(response.prompts);
        } else {
          setPrompts(getFallbackPrompts());
          setErrorMessage("Showing local demo prompts until the backend has published items.");
        }
      } catch (error) {
        setPrompts(getFallbackPrompts());
        setErrorMessage(
          error instanceof ApiError
            ? `${error.message} Showing local demo prompts instead.`
            : "Unable to load live prompts right now. Showing local demo prompts instead."
        );
      } finally {
        hasLoadedPrompts.current = true;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }

    void loadPrompts();
  }, [searchQuery, selectedCategory]);

  function handleLikeChange(slug: string, liked: boolean) {
    setPrompts((current) =>
      current.map((prompt) =>
        prompt.slug === slug
          ? {
              ...prompt,
              ...("_id" in prompt
                ? {
                    likeCount: Math.max(
                      0,
                      prompt.likeCount + (liked ? 1 : -1)
                    ),
                    isLiked: liked,
                  }
                : {
                    likes: Math.max(0, prompt.likes + (liked ? 1 : -1)),
                  }),
            }
          : prompt
      )
    );
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    const params = new URLSearchParams(window.location.search);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const nextQuery = params.toString();
    router.replace(nextQuery ? `/browse?${nextQuery}` : "/browse");
    window.dispatchEvent(
      new CustomEvent<FilterChangeDetail>("promptx:filters-changed", {
        detail: {
          category,
          search: params.get("search") || "",
        },
      })
    );
  }

  const content = (() => {
    if (isLoading) {
      return (
        <div className="rounded-2xl border border-border/50 bg-card/40 p-8 text-sm text-muted-foreground">
          Loading prompts from the marketplace...
        </div>
      );
    }

    if (!prompts.length) {
      return (
        <div className="rounded-2xl border border-border/50 bg-card/40 p-8 text-sm text-muted-foreground">
          No prompts found for this filter yet.
        </div>
      );
    }

    return (
      <>
        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            {errorMessage}
          </div>
        ) : null}
        <div
          className={`grid grid-cols-2 gap-2 transition-opacity duration-200 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${
            isRefreshing ? "opacity-60" : "opacity-100"
          }`}
        >
          {prompts.map((prompt, index) => (
            <div
              key={"_id" in prompt ? prompt._id : prompt.id}
              className="h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PromptCard
                prompt={prompt}
                accessLabel="Marketplace"
                accessTone="free"
                className="card-glow h-full border-border/50 transition-all duration-300 hover:-translate-y-1"
                onLikeChange={handleLikeChange}
              />
            </div>
          ))}
        </div>
      </>
    );
  })();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-3 pt-16 pb-8">
        {/* Header */}
        <div className="mb-5 animate-fade-in">
          <h1 className="mb-2 text-3xl font-bold gradient-text md:text-4xl">
            Browse Prompts
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            Explore free prompts first. The feed is ranked by live engagement so the hottest prompts rise to the top.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {searchQuery ? (
          <div className="mb-4 rounded-2xl border border-border/50 bg-card/30 p-4 text-sm text-muted-foreground">
            Showing results for <span className="font-medium text-foreground">{searchQuery}</span>
            {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}.
          </div>
        ) : null}

        {/* Prompts Grid */}
        {content}

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-border/50 bg-card/40 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Want the paid collection?</p>
            <p className="text-sm text-muted-foreground">
              Paid prompts are separated from the default feed and reserved for the top 1% premium set.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/browse/premium">Browse Premium Prompts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
