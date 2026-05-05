import { DiscoverCarousel } from "../components/discover-carousel";
import { Hero } from "../components/hero-section";
import { Navbar } from "../components/navbar";
import { Stats } from "../components/stats";
import { serverApiFetch } from "@/lib/api";
import { categories as fallbackCategories, freePrompts, rankPromptsByEngagement } from "@/lib/prompts";
import type { CategoryListResponse, PromptListResponse } from "@/lib/types";

export const LandingPage = async () => {
  const [categoriesResponse, promptResponse] = await Promise.all([
    serverApiFetch<CategoryListResponse>("/categories?limit=12").catch(() => null),
    serverApiFetch<PromptListResponse>("/prompts?limit=8&sortBy=ranking").catch(
      () => null
    ),
  ]);

  const categories =
    categoriesResponse?.categories?.length
      ? categoriesResponse.categories
      : fallbackCategories
          .filter((category) => category !== "All")
          .map((category) => ({
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, "-"),
            promptCount: freePrompts.filter((prompt) => prompt.category === category).length,
            averageAiScore: 0,
            averageRating: 0,
          }));
  const prompts =
    promptResponse?.prompts?.length
      ? promptResponse.prompts
      : rankPromptsByEngagement(freePrompts).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <DiscoverCarousel categories={categories} initialPrompts={prompts} />
    </div>
  );
};
