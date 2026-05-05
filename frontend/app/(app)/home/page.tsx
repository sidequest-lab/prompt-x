import Link from "next/link";
import { Activity, ArrowRight, Compass, LibraryBig, Sparkles, Users } from "lucide-react";
import { HomeDiscover } from "@/app/modules/components/home-discover";
import { Navbar } from "@/app/modules/components/navbar";
import { PersonalizedRecommendations } from "@/app/modules/components/personalized-recommendations";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverApiFetch } from "@/lib/api";
import type {
  CategoryListResponse,
  CreatorListResponse,
  PromptListResponse,
  StatsResponse,
} from "@/lib/types";

export default async function HomePage() {
  const [statsResponse, trendingResponse, recommendedResponse, categoriesResponse, creatorsResponse] =
    await Promise.all([
      serverApiFetch<StatsResponse>("/stats/overview").catch(() => null),
      serverApiFetch<PromptListResponse>("/prompts/trending").catch(() => null),
      serverApiFetch<PromptListResponse>("/prompts/recommended?limit=4").catch(() => null),
      serverApiFetch<CategoryListResponse>("/categories?limit=12").catch(() => null),
      serverApiFetch<CreatorListResponse>("/creators?limit=4").catch(() => null),
    ]);

  const stats = statsResponse?.stats;
  const trending = trendingResponse?.prompts || [];
  const recommended = recommendedResponse?.prompts || [];
  const categories = categoriesResponse?.categories || [];
  const creators = creatorsResponse?.creators || [];

  const overviewCards = [
    {
      label: "Published Prompts",
      value: stats?.promptCount ?? 0,
      icon: LibraryBig,
    },
    {
      label: "Creators",
      value: stats?.creatorCount ?? 0,
      icon: Users,
    },
    {
      label: "Reviews",
      value: stats?.totalReviews ?? 0,
      icon: Activity,
    },
    {
      label: "Average Rating",
      value: stats?.averageRating ?? 0,
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <section className="mb-10 rounded-[2rem] border border-border/50 bg-card/40 p-8 shadow-[0_0_60px_rgba(34,197,94,0.08)]">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              System Dashboard
            </Badge>
            <Badge variant="outline">Live ranking + evaluation + engagement</Badge>
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
            PromptX is now wired as a working marketplace, not just a landing page.
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            Browse ranked prompts, inspect evaluation output, upload new prompts, and
            track marketplace activity across creators, categories, and reviews.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-to-r from-primary to-tertiary hover:opacity-90">
              <Link href="/upload">
                Upload Prompt
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/browse">Open Ranked Feed</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/profile">Open Workspace</Link>
            </Button>
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => {
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
                  <p className="text-3xl font-semibold tracking-tight">
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <HomeDiscover categories={categories} initialPrompts={trending.slice(0, 4)} />

        <div className="grid gap-10 xl:grid-cols-[1.35fr_0.65fr]">
          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Trending Prompts</h2>
                <p className="text-sm text-muted-foreground">
                  Top prompts from the ranking engine, influenced by AI score and engagement.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/browse">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {trending.map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  accessLabel="Trending"
                  accessTone="free"
                  className="border-border/50 bg-card/40"
                />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <Card className="border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/browse?category=${encodeURIComponent(category.name)}`}
                    className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/40 p-4 transition-colors hover:border-primary/40"
                  >
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.promptCount} prompts • AI {category.averageAiScore}
                      </p>
                    </div>
                    <Compass className="h-4 w-4 text-primary" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle>Leading Creators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {creators.map((creator) => (
                  <Link
                    key={creator._id}
                    href={`/creators/${creator._id}`}
                    className="block rounded-2xl border border-border/50 bg-background/40 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{creator.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {creator.activePrompts} prompts • {creator.totalViews.toLocaleString()} views
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        <PersonalizedRecommendations fallbackPrompts={recommended} />
      </div>
    </div>
  );
}
