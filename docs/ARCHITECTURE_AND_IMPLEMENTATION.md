# PromptX Architecture And Implementation Guide

## Purpose

This document explains how the current PromptX codebase maps to the intended system architecture, what is implemented today, and where future work should extend the platform.

It is written to help with:

- onboarding
- code review
- product planning
- handoff to future contributors
- validating the repo against the system diagram

## Current Status

PromptX is now implemented as a working full-stack marketplace flow with:

- presentation layer pages for landing, browse, prompt detail, categories, creators, creator profile, auth, profile workspace, and prompt submission
- application layer REST APIs for auth, prompts, reviews, categories, creators, stats, and workspace data
- evaluation layer support for AI prompt scoring with OpenAI plus heuristic fallback
- ranking and recommendation services driven by prompt quality and user engagement
- data layer persistence in MongoDB for prompts, users, likes, favorites, reviews, evaluation tasks, and user activity

## System Diagram Mapping

### 1. Presentation Layer

The presentation layer is implemented in the Next.js app under `app/` and shared UI under `app/modules/components/`.

Main pages:

- `/` landing page
- `/home` dashboard-style overview page
- `/browse` ranked prompt feed
- `/browse/[slug]` prompt detail page
- `/browse/premium` premium/demo page
- `/categories` live category listing
- `/creators` creator directory
- `/creators/[id]` creator detail page
- `/profile` logged-in user workspace
- `/submit` prompt submission flow
- `/auth`, `/login`, `/signup` auth entry points

Main presentation responsibilities already implemented:

- browse ranked prompts
- open prompt details
- like prompts
- save prompts
- submit reviews
- submit new prompts
- inspect creator data
- inspect category data
- inspect workspace activity
- search and filter the marketplace feed

Important frontend files:

- `app/(app)/browse/page.tsx`
- `app/(app)/browse/[slug]/page.tsx`
- `app/(app)/submit/page.tsx`
- `app/(app)/profile/page.tsx`
- `app/(app)/categories/page.tsx`
- `app/(app)/creators/page.tsx`
- `app/(app)/creators/[id]/page.tsx`
- `app/(app)/home/page.tsx`
- `app/modules/components/prompt-card.tsx`
- `app/modules/components/prompt-feedback.tsx`
- `app/modules/components/navbar.tsx`

### 2. Application Layer

The application layer is the Express backend under `backend/src/`.

Implemented route groups:

- auth routes
- prompt routes
- review routes
- category routes
- user routes
- stats routes

Implemented controller groups:

- `authController`
- `promptController`
- `reviewController`
- `categoryController`
- `userController`
- `statsController`

Application layer responsibilities already implemented:

- registration, login, refresh, logout, current-user lookup
- prompt CRUD
- prompt listing with query filters
- trending prompts
- recommended prompts
- prompt detail by id or slug
- prompt views
- likes and favorites
- review creation, update, deletion, and listing
- category summaries
- creator listing and creator profile lookup
- workspace summary for logged-in users
- system overview stats

Important backend files:

- `backend/app.js`
- `backend/server.js`
- `backend/src/routes/index.js`
- `backend/src/routes/promptRoutes.js`
- `backend/src/routes/reviewRoutes.js`
- `backend/src/routes/userRoutes.js`
- `backend/src/routes/categoryRoutes.js`
- `backend/src/routes/statsRoutes.js`

### 3. Evaluation Layer

The evaluation layer is implemented in backend services.

Implemented pieces:

- evaluation service
- prompt evaluation queue
- evaluation task persistence
- OpenAI evaluation request support
- heuristic fallback if OpenAI is unavailable
- ranking recalculation after evaluation

How it works:

1. A user submits a prompt.
2. The prompt is stored with `evaluationStatus = pending`.
3. A background evaluation task is created.
4. The queue processor evaluates the prompt.
5. The prompt receives `aiScore`, `evaluationSummary`, and `evaluationSource`.
6. Ranking is recalculated.

Key files:

- `backend/src/services/evaluationService.js`
- `backend/src/services/evaluationQueueService.js`
- `backend/src/jobs/promptEvaluationJob.js`
- `backend/src/models/EvaluationTask.js`
- `backend/src/utils/heuristicEvaluation.js`

### 4. Ranking And Recommendation Layer

The ranking and recommendation layer is implemented and connected to prompt creation, prompt views, likes, favorites, reviews, and evaluation.

Implemented pieces:

- engagement score calculation
- ranking score calculation
- ranking recalculation service
- trending feed
- recommendation service using favorite tags and user activity
- personalized and fallback recommendations

Signals currently used:

- AI score
- average review rating
- review count
- views
- favorite count
- like count
- engagement score
- freshness/recency
- user favorite tags
- activity tag history

Key files:

- `backend/src/services/engagementService.js`
- `backend/src/services/rankingService.js`
- `backend/src/utils/ranking.js`
- `backend/src/services/recommendationService.js`
- `backend/src/services/activityService.js`

### 5. Data Layer

MongoDB models currently in use:

- `User`
- `Prompt`
- `Review`
- `Like`
- `Favorite`
- `UserActivity`
- `EvaluationTask`

The current data layer covers the intent of the system diagram:

- user DB
- prompt DB
- engagement DB
- AI output evaluation DB

In practice, these are represented as collections rather than separately deployed databases.

Key model files:

- `backend/src/models/User.js`
- `backend/src/models/Prompt.js`
- `backend/src/models/Review.js`
- `backend/src/models/Like.js`
- `backend/src/models/Favorite.js`
- `backend/src/models/UserActivity.js`
- `backend/src/models/EvaluationTask.js`

## End-To-End Flows

### Flow 1: Browse And Open A Prompt

1. Frontend calls `GET /api/v1/prompts`.
2. Backend returns ranked prompt listings.
3. User opens `/browse/[slug]`.
4. Frontend loads prompt details and reviews.
5. Prompt detail component records a view once per session.
6. Backend updates views, engagement score, and ranking score.

### Flow 2: Submit A Prompt

1. Logged-in user opens `/submit`.
2. Frontend posts to `POST /api/v1/prompts`.
3. Backend stores the prompt.
4. Activity is logged as `create`.
5. Evaluation queue is triggered.
6. Prompt appears in the marketplace and later receives evaluation output.

### Flow 3: Like Or Save A Prompt

1. User clicks like or save in the feed or detail view.
2. Frontend calls prompt like/favorite endpoints.
3. Backend writes like/favorite records.
4. Prompt stats are recalculated.
5. Engagement score and ranking score are recalculated.
6. Activity is logged for recommendation input.

### Flow 4: Review A Prompt

1. User submits a review from the prompt detail page.
2. Frontend posts to `POST /api/v1/prompts/:id/reviews`.
3. Backend stores the review.
4. Prompt rating averages and counts are recalculated.
5. Engagement and ranking scores are updated.
6. Review activity is logged.

### Flow 5: Personalized Recommendations

1. Backend loads recent `UserActivity`.
2. Backend combines activity tags with `favoriteTags` from the user profile.
3. Preferred tags are weighted.
4. Matching prompts are returned ranked by score and social proof.

### Flow 6: Workspace Overview

1. Logged-in user opens `/profile`.
2. Frontend requests `GET /api/v1/users/me/workspace`.
3. Backend returns:
   - user profile
   - authored prompts
   - saved prompts
   - liked prompts
   - recent activity
   - workspace metrics

## API Summary

### Auth

- `POST /api/v1/register`
- `POST /api/v1/login`
- `POST /api/v1/refresh`
- `POST /api/v1/logout`
- `GET /api/v1/me`

### Prompts

- `GET /api/v1/prompts`
- `GET /api/v1/prompts/trending`
- `GET /api/v1/prompts/recommended`
- `GET /api/v1/prompts/:idOrSlug`
- `POST /api/v1/prompts`
- `PATCH /api/v1/prompts/:id`
- `DELETE /api/v1/prompts/:id`
- `POST /api/v1/prompts/:id/view`
- `POST /api/v1/prompts/:id/like`
- `DELETE /api/v1/prompts/:id/like`
- `POST /api/v1/prompts/:id/favorite`
- `DELETE /api/v1/prompts/:id/favorite`
- `POST /api/v1/prompts/:id/evaluate`

### Reviews

- `POST /api/v1/prompts/:id/reviews`
- `GET /api/v1/prompts/:id/reviews`
- `PATCH /api/v1/reviews/:id`
- `DELETE /api/v1/reviews/:id`

### Categories

- `GET /api/v1/categories`

### Creators And Users

- `GET /api/v1/creators`
- `GET /api/v1/creators/:id`
- `GET /api/v1/users/:id`
- `GET /api/v1/users/:id/prompts`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/me/workspace`

### Stats

- `GET /api/v1/stats/overview`

## Testing And Validation

Backend checks already present:

- health route test
- ranking utility test
- heuristic evaluation test

Frontend validation that should be used regularly:

- `npm run lint`
- `npm run build`

Backend validation:

- `npm --prefix backend test`

## Environment Requirements

Frontend:

- `NEXT_PUBLIC_API_BASE_URL`

Backend:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_TIMEOUT_MS`
- `REDIS_URL`
- `CORS_ORIGIN`
- `LOG_LEVEL`

Notes:

- Redis is optional.
- OpenAI is optional because heuristic scoring is available as fallback.

## What Is Still Not In Scope

The main system diagram is now represented in code, but these are still future enhancements rather than core missing architecture:

- payment and monetization workflows
- premium entitlements and purchase verification
- admin moderation dashboard
- notification system
- analytics dashboards beyond current summaries
- creator follow system
- full profile editing UI
- image upload and media pipeline
- richer search ranking and autocomplete
- separate worker deployment for evaluation jobs
- Redis-backed queue processing

## Recommended Next Build Order

1. Admin and moderation tools
2. Premium/purchase flows
3. Profile editing UX
4. Better analytics dashboards
5. Follow system and social graph
6. Stronger search and discovery

## Ownership Guide

If you are changing frontend marketplace behavior, start here:

- `app/(app)/browse`
- `app/(app)/browse/[slug]`
- `app/modules/components/prompt-card.tsx`
- `app/modules/components/prompt-feedback.tsx`

If you are changing ranking or recommendation behavior, start here:

- `backend/src/utils/ranking.js`
- `backend/src/services/rankingService.js`
- `backend/src/services/recommendationService.js`
- `backend/src/services/activityService.js`

If you are changing evaluation behavior, start here:

- `backend/src/services/evaluationService.js`
- `backend/src/services/evaluationQueueService.js`

If you are changing workspace/profile data, start here:

- `backend/src/services/userService.js`
- `app/(app)/profile/page.tsx`
- `lib/types.ts`
