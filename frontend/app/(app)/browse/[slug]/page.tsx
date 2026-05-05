import Link from "next/link";
import { notFound } from "next/navigation";
import { AiScoreCard } from "@/app/modules/components/ai-score-card";
import { Navbar } from "@/app/modules/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp } from "lucide-react";
import { PromptCard } from "@/app/modules/components/prompt-card";
import { PromptFeedback } from "@/app/modules/components/prompt-feedback";
import { serverApiFetch } from "@/lib/api";
import {
  getPromptBySlug,
  getRelatedPrompts,
  type Prompt as MockPrompt,
} from "@/lib/prompts";
import type {
  MarketplacePrompt,
  MarketplaceReview,
  PromptListResponse,
  PromptResponse,
  ReviewListResponse,
} from "@/lib/types";

type PromptPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PromptPage({ params }: PromptPageProps) {
  const { slug } = await params;
  let prompt: MarketplacePrompt | MockPrompt;
  let reviews: MarketplaceReview[] = [];
  let relatedPrompts: Array<MarketplacePrompt | MockPrompt> = [];
  let isMockPrompt = false;

  try {
    const promptResponse = await serverApiFetch<PromptResponse>(
      `/prompts/${slug}`
    );
    const livePrompt = promptResponse.prompt;
    prompt = livePrompt;
    const [reviewResponse, relatedResponse] = await Promise.all([
      serverApiFetch<ReviewListResponse>(`/prompts/${livePrompt._id}/reviews?limit=10`),
      serverApiFetch<PromptListResponse>(
        `/prompts?category=${encodeURIComponent(livePrompt.category)}&limit=6&sortBy=ranking`
      ),
    ]);
    reviews = reviewResponse.reviews;
    relatedPrompts = relatedResponse.prompts.filter(
      (relatedPrompt) => relatedPrompt._id !== livePrompt._id
    ).slice(0, 4);
  } catch {
    const fallbackPrompt = getPromptBySlug(slug);

    if (!fallbackPrompt) {
      notFound();
    }

    isMockPrompt = true;
    prompt = fallbackPrompt;
    reviews = fallbackPrompt.comments.map((comment) => ({
      _id: String(comment.id),
      rating: fallbackPrompt.rating,
      comment: comment.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        name: comment.author,
      },
    }));
    relatedPrompts = getRelatedPrompts(fallbackPrompt);
  }

  const aiScore = "aiScore" in prompt
    ? prompt.aiScore
    : {
        clarity: Math.round(prompt.rating * 19),
        creativity: Math.round(prompt.rating * 20),
        relevance: Math.round(prompt.rating * 18),
        overall: Math.round(prompt.rating * 20),
      };

  const evaluationSummary =
    "evaluationSummary" in prompt
      ? prompt.evaluationSummary
      : prompt.excerpt;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-border/50 bg-card/40 p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {prompt.category}
              </Badge>
              {"status" in prompt ? (
                <Badge variant="outline">
                  {prompt.status}
                </Badge>
              ) : null}
              <Badge variant="outline">
                {"evaluationStatus" in prompt ? prompt.evaluationStatus : "demo"}
              </Badge>
            </div>

            <h1 className="mb-3 text-4xl font-bold gradient-text">{prompt.title}</h1>
            <p className="max-w-3xl text-lg text-muted-foreground">{prompt.description}</p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {"ratingAverage" in prompt
                    ? prompt.ratingAverage.toFixed(1)
                    : prompt.rating.toFixed(1)}{" "}
                  rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{"views" in prompt ? prompt.views : prompt.sales} views</span>
              </div>
              <span>{"likeCount" in prompt ? prompt.likeCount : prompt.likes} likes</span>
              <span>{"favoriteCount" in prompt ? prompt.favoriteCount : 0} saves</span>
              <span>{"reviewCount" in prompt ? prompt.reviewCount : prompt.comments.length} reviews</span>
              {"author" in prompt && prompt.author._id ? (
                <Link href={`/creators/${prompt.author._id}`} className="hover:text-primary">
                  By {prompt.author.name}
                </Link>
              ) : (
                <span>By {"author" in prompt ? prompt.author.name : prompt.creator}</span>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-border/50 bg-background/70 p-6">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Prompt Content
              </p>
              <p className="whitespace-pre-wrap text-base leading-7 text-foreground">
                {"content" in prompt ? prompt.content : prompt.excerpt}
              </p>
            </div>
          </section>

          <AiScoreCard
            score={aiScore}
            summary={evaluationSummary}
            status={"evaluationStatus" in prompt ? prompt.evaluationStatus : "demo"}
            source={"evaluationSource" in prompt ? prompt.evaluationSource : "local-seed"}
          />
        </div>

        <PromptFeedback
          promptId={"_id" in prompt ? prompt._id : undefined}
          promptSlug={prompt.slug}
          initialLikes={"likeCount" in prompt ? prompt.likeCount : prompt.likes}
          initialLiked={"isLiked" in prompt ? prompt.isLiked : false}
          initialComments={reviews}
        />

        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">More Free Prompts</h2>
              <p className="text-sm text-muted-foreground">
                Free prompts always appear first below the prompt you opened.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/browse/premium">Go To Paid Prompts</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {relatedPrompts.map((relatedPrompt) => (
              <PromptCard
                key={"_id" in relatedPrompt ? relatedPrompt._id : relatedPrompt.id}
                prompt={relatedPrompt}
                accessLabel={isMockPrompt ? "Demo Related" : "Related"}
                accessTone={"access" in relatedPrompt && relatedPrompt.access === "premium" ? "premium" : "free"}
                className="border-border/50 bg-card/40"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
