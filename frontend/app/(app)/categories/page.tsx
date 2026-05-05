import Link from "next/link";
import { ArrowRight, BarChart3, Layers3, Sparkles, Star } from "lucide-react";
import { Navbar } from "@/app/modules/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverApiFetch } from "@/lib/api";
import type { CategoryListResponse } from "@/lib/types";

export default async function CategoriesPage() {
  const response = await serverApiFetch<CategoryListResponse>("/categories?limit=24").catch(
    () => null
  );
  const categories = response?.categories || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-10 max-w-3xl">
          <Badge className="mb-4 border-primary/30 bg-primary/15 text-primary">
            Category Intelligence
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Categories grouped from live marketplace data.
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Each category below is computed from published prompts in the data layer,
            with quality and rating signals carried through from evaluation and reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.slug} className="border-border/50 bg-card/40">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <Badge variant="outline">{category.name}</Badge>
                  <Layers3 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-2xl">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                    <BarChart3 className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <p className="text-lg font-semibold">{category.promptCount}</p>
                    <p className="text-xs text-muted-foreground">Prompts</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                    <Sparkles className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <p className="text-lg font-semibold">{category.averageAiScore}</p>
                    <p className="text-xs text-muted-foreground">AI score</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                    <Star className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <p className="text-lg font-semibold">{category.averageRating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-primary to-tertiary hover:opacity-90">
                  <Link href={`/browse?category=${encodeURIComponent(category.name)}`}>
                    Browse {category.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
