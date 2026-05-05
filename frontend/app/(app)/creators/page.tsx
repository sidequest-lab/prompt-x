import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Users } from "lucide-react";
import { Navbar } from "@/app/modules/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverApiFetch } from "@/lib/api";
import type { CreatorListResponse } from "@/lib/types";

export default async function CreatorsPage() {
  const response = await serverApiFetch<CreatorListResponse>("/creators?limit=24").catch(
    () => null
  );
  const creators = response?.creators || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-10 max-w-3xl">
          <Badge className="mb-4 border-primary/30 bg-primary/15 text-primary">
            Creator Directory
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Marketplace creators ranked by output and traction.
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            These creators are sourced from the live user and prompt collections,
            with stats aggregated from published prompt performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {creators.map((creator) => (
            <Card key={creator._id} className="border-border/50 bg-card/40">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <Badge variant="outline">Creator</Badge>
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-2xl">{creator.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {creator.bio || "Building prompt systems for the PromptX marketplace."}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                    <Users className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <p className="text-lg font-semibold">{creator.activePrompts}</p>
                    <p className="text-xs text-muted-foreground">Prompts</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                    <TrendingUp className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <p className="text-lg font-semibold">{creator.totalViews}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                    <Star className="mx-auto mb-2 h-4 w-4 text-primary" />
                    <p className="text-lg font-semibold">{creator.averageRating?.toFixed?.(1) ?? creator.averageRating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(creator.favoriteTags || []).slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-primary to-tertiary hover:opacity-90">
                  <Link href={`/creators/${creator._id}`}>
                    View Creator
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
