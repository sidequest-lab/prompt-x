"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import type { MarketplacePrompt, PromptListResponse } from "@/lib/types";

type PersonalizedRecommendationsProps = {
  fallbackPrompts: MarketplacePrompt[];
};

export function PersonalizedRecommendations({
  fallbackPrompts,
}: PersonalizedRecommendationsProps) {
  const [prompts, setPrompts] = useState<MarketplacePrompt[]>(fallbackPrompts);
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await apiFetch<PromptListResponse>(
          "/prompts/recommended?limit=4"
        );

        if (response.prompts.length) {
          setPrompts(response.prompts);
          setIsPersonalized(
            response.prompts.some((prompt) => prompt.recommendationReason)
          );
        }
      } catch {
        setPrompts(fallbackPrompts);
        setIsPersonalized(false);
      }
    }

    void loadRecommendations();
  }, [fallbackPrompts]);

  if (!prompts.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <p className="text-sm text-muted-foreground">
            {isPersonalized
              ? "Based on your recent views, likes, saves, reviews, and preferred prompt categories."
              : "Sign in and interact with prompts to personalize this feed."}
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/10 text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isPersonalized ? "Personalized" : "Popular fallback"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {prompts.map((prompt) => (
          <div key={prompt._id} className="space-y-2">
            <PromptCard
              prompt={prompt}
              accessLabel="Recommended"
              accessTone="free"
              className="border-border/50 bg-card/40"
            />
            {prompt.recommendationReason ? (
              <p className="rounded-xl border border-border/50 bg-background/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
                {prompt.recommendationReason}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
