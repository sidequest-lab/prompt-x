import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  const samplePrompts = [
    {
      title: "High-Quality Code Generator",
      category: "Coding",
      score: 92,
      rating: "5.0",
    },
    {
      title: "Business Strategy Builder",
      category: "Business",
      score: 89,
      rating: "4.8",
    },
    {
      title: "UX Research Plan",
      category: "Design",
      score: 84,
      rating: "4.9",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/50 pt-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,hsl(240_10%_5%),hsl(240_10%_3.9%))]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(hsl(240_10%_100%/0.025)_1px,transparent_1px),linear-gradient(90deg,hsl(240_10%_100%/0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-12 px-4 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="max-w-2xl animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/45 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-ranked prompt marketplace
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-normal text-foreground md:text-5xl lg:text-[3.4rem]">
            Find reliable prompts ranked by quality and real engagement.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            PromptX helps teams discover, compare, and save practical prompts with
            AI evaluation, ratings, category filters, and live usage signals in one
            focused workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-11 bg-gradient-to-r from-primary to-tertiary px-5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              <Link href="/browse">
                Browse marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 border-border/70 bg-card/40 px-5 text-sm font-semibold backdrop-blur-sm"
            >
              <Link href="/upload">Upload a prompt</Link>
            </Button>
          </div>

          <div className="mt-8 grid max-w-xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              AI quality scoring
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Engagement ranking
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Saved workflows
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="rounded-lg border border-border/70 bg-card/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Marketplace ranking</p>
                <p className="text-xs text-muted-foreground">Live quality and engagement view</p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
                Search prompts
              </div>
            </div>

            <div className="grid gap-3 p-4">
              {samplePrompts.map((prompt, index) => (
                <div
                  key={prompt.title}
                  className="rounded-md border border-border/60 bg-background/55 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 inline-flex rounded-md bg-primary/15 px-2 py-1 text-xs font-medium text-primary">
                        {prompt.category}
                      </div>
                      <p className="font-medium text-foreground">{prompt.title}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {prompt.rating}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5" />
                          AI score {prompt.score}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-card text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary"
                      style={{ width: `${prompt.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 border-t border-border/60 text-center">
              {[
                ["50", "published prompts"],
                ["12", "categories"],
                ["AI", "scored ranking"],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-border/60 px-3 py-4 last:border-r-0">
                  <div className="text-lg font-semibold text-foreground">{value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
