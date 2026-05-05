import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/app/modules/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { serverApiFetch } from "@/lib/api";
import type {
  CreatorResponse,
  PromptListResponse,
} from "@/lib/types";

type CreatorPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { id } = await params;

  const [creatorResponse, promptsResponse] = await Promise.all([
    serverApiFetch<CreatorResponse>(`/creators/${id}`).catch(() => null),
    serverApiFetch<PromptListResponse>(`/users/${id}/prompts?limit=12`).catch(() => null),
  ]);

  if (!creatorResponse?.creator) {
    notFound();
  }

  const creator = creatorResponse.creator;
  const prompts = promptsResponse?.prompts || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <section className="mb-10 rounded-[2rem] border border-border/50 bg-card/40 p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge className="border-primary/30 bg-primary/15 text-primary">
              Creator Profile
            </Badge>
            <Badge variant="outline">{creator.stats.activePrompts} published prompts</Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">{creator.name}</h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            {creator.bio || "This creator is publishing prompts on the live PromptX marketplace."}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="border-border/50 bg-background/40">
              <CardHeader>
                <CardTitle className="text-base">Active Prompts</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {creator.stats.activePrompts}
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-background/40">
              <CardHeader>
                <CardTitle className="text-base">Total Views</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {creator.stats.totalViews}
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-background/40">
              <CardHeader>
                <CardTitle className="text-base">Average Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {creator.stats.averageRating?.toFixed?.(1) ?? creator.stats.averageRating}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {(creator.favoriteTags || []).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-bold">Published Prompts</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                accessLabel="Creator"
                accessTone="free"
                className="border-border/50 bg-card/40"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
