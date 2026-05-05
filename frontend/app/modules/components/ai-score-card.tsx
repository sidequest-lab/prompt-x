"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PromptAiScore } from "@/lib/types";

type AiScoreCardProps = {
  score: PromptAiScore;
  summary?: string;
  status?: string;
  source?: string;
};

const scoreItems: Array<keyof PromptAiScore> = [
  "clarity",
  "creativity",
  "relevance",
];

export function AiScoreCard({
  score,
  summary,
  status,
  source,
}: AiScoreCardProps) {
  return (
    <Card className="border-border/50 bg-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Overall Score
          </p>
          <p className="mt-2 text-4xl font-semibold text-primary">
            {score.overall}
          </p>
          {(status || source) ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {status ? <span>Status: {status}</span> : null}
              {source ? <span>Source: {source}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          {scoreItems.map((key) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="capitalize">{key}</span>
                <span className="text-muted-foreground">{score[key]}</span>
              </div>
              <div className="h-2 rounded-full bg-background/80">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-tertiary"
                  style={{ width: `${Math.max(0, Math.min(score[key], 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {summary ? (
          <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
            <p className="text-sm font-medium">Why this prompt is good</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {summary}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
