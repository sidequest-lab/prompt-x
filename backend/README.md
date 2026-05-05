# PromptX Backend

Express + MongoDB backend for PromptX with:

- JWT authentication and refresh rotation
- prompt CRUD, AI evaluation, ranking, reviews, favorites, and recommendations
- background evaluation queue persistence in MongoDB
- pagination on prompt, creator, review, and category listings
- security middleware and health/readiness probes

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start MongoDB locally or point `MONGODB_URI` to your database
4. Start the API with `npm run dev`
5. Run checks with `npm test`

## Core Endpoints

- `GET /health`
- `GET /health/ready`
- `POST /api/v1/register`
- `POST /api/v1/login`
- `POST /api/v1/refresh`
- `POST /api/v1/logout`
- `GET /api/v1/me`
- `GET /api/v1/prompts`
- `GET /api/v1/prompts/trending`
- `GET /api/v1/prompts/recommended`
- `POST /api/v1/prompts`
- `GET /api/v1/prompts/:idOrSlug`
- `POST /api/v1/prompts/:id/view`
- `POST /api/v1/prompts/:id/favorite`
- `DELETE /api/v1/prompts/:id/favorite`
- `POST /api/v1/prompts/:id/reviews`
- `GET /api/v1/categories`
- `GET /api/v1/creators`
- `GET /api/v1/stats/overview`

## Environment

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `GROQ_TIMEOUT_MS`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_TIMEOUT_MS`
- `REDIS_URL`
- `CORS_ORIGIN`
- `LOG_LEVEL`

## Notes

- If `GROQ_API_KEY` is set, prompt evaluation uses Groq's OpenAI-compatible chat completions API.
- If `GROQ_API_KEY` is not set but `OPENAI_API_KEY` is set, prompt evaluation uses OpenAI.
- If no hosted AI key is set, prompt evaluation falls back to a heuristic scorer so the platform still works.
- Redis is optional. The backend runs without it, but will report Redis as disabled in health responses.
- Queue persistence is stored in MongoDB through the `evaluationtasks` collection.
