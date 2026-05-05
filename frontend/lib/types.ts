export type ApiErrorShape = {
  success: false;
  message: string;
  details?: unknown;
};

export type PromptAuthor = {
  _id?: string;
  id?: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  favoriteTags?: string[];
};

export type PromptAiScore = {
  clarity: number;
  creativity: number;
  relevance: number;
  overall: number;
};

export type MarketplacePrompt = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  status: string;
  aiScore: PromptAiScore;
  evaluationStatus: string;
  evaluationSummary: string;
  evaluationSource: string;
  ratingAverage: number;
  ratingCount: number;
  reviewCount: number;
  favoriteCount: number;
  likeCount: number;
  views: number;
  engagementScore: number;
  rankingScore: number;
  author: PromptAuthor;
  isFavorited?: boolean;
  isLiked?: boolean;
  recommendationScore?: number;
  recommendationReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type MarketplaceReview = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id?: string;
    id?: string;
    name: string;
    avatarUrl?: string;
  };
};

export type PromptListResponse = {
  prompts: MarketplacePrompt[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type PromptResponse = {
  prompt: MarketplacePrompt;
};

export type ReviewListResponse = {
  reviews: MarketplaceReview[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type StatsOverview = {
  promptCount: number;
  creatorCount: number;
  averageRating: number;
  totalReviews: number;
};

export type StatsResponse = {
  stats: StatsOverview;
};

export type CategorySummary = {
  name: string;
  slug: string;
  promptCount: number;
  averageAiScore: number;
  averageRating: number;
};

export type CategoryListResponse = {
  categories: CategorySummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type UserProfile = {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  favoriteTags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreatorSummary = {
  _id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  favoriteTags?: string[];
  activePrompts: number;
  averageRating: number;
  totalViews: number;
};

export type CreatorListResponse = {
  creators: CreatorSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CreatorProfile = {
  _id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  favoriteTags?: string[];
  stats: {
    activePrompts: number;
    totalViews: number;
    averageRating: number;
  };
};

export type CreatorResponse = {
  creator: CreatorProfile;
};

export type UserResponse = {
  user: UserProfile;
};

export type WorkspaceActivity = {
  _id: string;
  type: string;
  createdAt: string;
  prompt: MarketplacePrompt;
};

export type WorkspaceMetrics = {
  publishedPromptCount: number;
  savedCount: number;
  likedCount: number;
  reviewsWrittenCount: number;
  totalViews: number;
  reviewsReceivedCount: number;
  averageRankingScore: number;
};

export type WorkspaceResponse = {
  user: UserProfile;
  metrics: WorkspaceMetrics;
  authoredPrompts: MarketplacePrompt[];
  savedPrompts: MarketplacePrompt[];
  likedPrompts: MarketplacePrompt[];
  recentActivity: WorkspaceActivity[];
};
