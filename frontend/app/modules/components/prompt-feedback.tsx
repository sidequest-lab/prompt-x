"use client";

import { useEffect, useState } from "react";
import { Heart, MessageSquare, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, ApiError } from "@/lib/api";
import { isPromptLiked, toggleStoredPromptLike } from "@/lib/prompts";
import { getStoredUser, type StoredUser } from "@/lib/session";
import type { MarketplacePrompt, MarketplaceReview, ReviewListResponse } from "@/lib/types";

type PromptFeedbackProps = {
  promptId?: string;
  promptSlug: string;
  initialLikes: number;
  initialLiked?: boolean;
  initialComments: MarketplaceReview[];
};

export function PromptFeedback({
  promptId,
  promptSlug,
  initialLikes,
  initialLiked = false,
  initialComments,
}: PromptFeedbackProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [liked, setLiked] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState("");

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  useEffect(() => {
    if (promptId) {
      const storedLiked = isPromptLiked(promptSlug);
      setLiked(initialLiked || storedLiked);
      setLikes(initialLikes + (storedLiked ? 1 : 0));
      setComments(initialComments);
      return;
    }

    const storedLiked = isPromptLiked(promptSlug);
    setLiked(storedLiked);
    setLikes(initialLikes + (storedLiked ? 1 : 0));
    setComments(initialComments);
  }, [initialComments, initialLiked, initialLikes, promptId, promptSlug]);

  useEffect(() => {
    if (!promptId) {
      return;
    }

    const storageKey = `promptx.viewed.${promptId}`;

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    window.sessionStorage.setItem(storageKey, "1");
    void apiFetch<{ prompt: MarketplacePrompt }>(`/prompts/${promptId}/view`, {
      method: "POST",
      includeAuth: true,
    }).catch(() => null);
  }, [promptId]);

  async function handleToggleLike() {
    if (promptId) {
      try {
        const nextLiked = !liked;
        await apiFetch<{ prompt: MarketplacePrompt }>(
          `/prompts/${promptId}/like`,
          { method: nextLiked ? "POST" : "DELETE" }
        );
        if (isPromptLiked(promptSlug) !== nextLiked) {
          toggleStoredPromptLike(promptSlug);
        }
        setLiked(nextLiked);
        setLikes((count) => count + (nextLiked ? 1 : -1));
        setActionMessage("");
      } catch (error) {
        const nextLiked = toggleStoredPromptLike(promptSlug);
        setLiked(nextLiked);
        setLikes((count) => count + (nextLiked ? 1 : -1));
        setActionMessage(
          error instanceof ApiError && error.statusCode === 401
            ? "Saved locally. Sign in to sync likes."
            : "Saved locally while the server is unavailable."
        );
      }
      return;
    }

    const nextLiked = toggleStoredPromptLike(promptSlug);
    setLiked(nextLiked);
    setLikes((count) => count + (nextLiked ? 1 : -1));
  }

  async function handleSubmitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!promptId) {
      setActionMessage("Demo prompts do not support review submission.");
      return;
    }

    if (!getStoredUser()) {
      setActionMessage("Sign in to add a review.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      setActionMessage("");

      await apiFetch<{ review: MarketplaceReview }>(`/prompts/${promptId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const refreshed = await apiFetch<ReviewListResponse>(
        `/prompts/${promptId}/reviews?limit=10`
      );
      setComments(refreshed.reviews);
      setComment("");
      setRating(5);
      setActionMessage("Review submitted and synced.");
    } catch (error) {
      setActionMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to submit your review right now."
      );
    } finally {
      setIsSubmittingReview(false);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    try {
      setDeletingReviewId(reviewId);
      setActionMessage("");

      await apiFetch<{ message: string }>(`/reviews/${reviewId}`, {
        method: "DELETE",
      });

      setComments((current) =>
        current.filter((review) => review._id !== reviewId)
      );
      setActionMessage("Review deleted.");
    } catch (error) {
      setActionMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to delete your review right now."
      );
    } finally {
      setDeletingReviewId("");
    }
  }

  return (
    <section className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-border/50 bg-card/40">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Prompt Feedback</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-2">
                <Heart className="h-3.5 w-3.5" />
                {likes} likes
              </Badge>
              <Badge variant="outline" className="gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                {comments.length} reviews
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant={liked ? "default" : "outline"}
              onClick={handleToggleLike}
            >
              <Heart className={liked ? "fill-current" : ""} />
              {liked ? "Liked" : "Like Prompt"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Your rating</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={rating === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRating(value)}
                  >
                    <Star className={rating >= value ? "fill-current" : ""} />
                    {value}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Review</label>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share how useful this prompt was and what stood out."
                className="min-h-28 w-full rounded-2xl border border-border/50 bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                maxLength={500}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmittingReview}>
              {isSubmittingReview ? "Submitting review..." : "Submit Review"}
            </Button>
          </form>

          {actionMessage ? (
            <p className="text-sm text-amber-300">{actionMessage}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/40">
        <CardHeader>
          <CardTitle>Community Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length ? comments.map((comment) => {
            const commentUserId = comment.user?._id || comment.user?.id;
            const canDelete =
              Boolean(currentUser?.id && commentUserId === currentUser.id) ||
              currentUser?.role === "admin";

            return (
              <div
                key={comment._id}
                className="rounded-2xl border border-border/50 bg-background/60 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{comment.user?.name || "Anonymous"}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-yellow-300">
                      <Star className="h-3 w-3 fill-current" />
                      {comment.rating}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {canDelete ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleDeleteReview(comment._id)}
                        disabled={deletingReviewId === comment._id}
                        aria-label="Delete review"
                        className="h-8 w-8 border-destructive/40 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {comment.comment || "No written review provided."}
                </p>
              </div>
            );
          }) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet. This prompt is still building social proof.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
