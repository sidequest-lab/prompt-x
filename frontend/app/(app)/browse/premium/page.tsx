"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Navbar } from "@/app/modules/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { premiumPrompts, type Prompt } from "@/lib/prompts";

export default function PremiumPromptsPage() {
  const [items, setItems] = useState<Prompt[]>(premiumPrompts);
  const prompts = useMemo(() => items, [items]);

  function handleLikeChange(slug: string, liked: boolean) {
    setItems((current) =>
      current.map((prompt) =>
        prompt.slug === slug
          ? {
              ...prompt,
              likes: Math.max(0, prompt.likes + (liked ? 1 : -1)),
            }
          : prompt
      )
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-10 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-300">
            Premium Collection
          </Badge>
          <h1 className="mb-3 text-4xl font-bold gradient-text">Paid Prompts</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            This area is separate from the default browse flow. Only the strongest prompts belong here.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link href="/browse">Back To Free Prompts</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              accessLabel="Top 1% Premium"
              accessTone="premium"
              ctaLabel="Premium details"
              className="border-amber-500/20 bg-card/40"
              showExcerpt
              onLikeChange={handleLikeChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
