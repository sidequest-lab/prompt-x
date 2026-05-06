# PromptX

PromptX is organized as a full-stack application with separate frontend and backend workspaces.

## Project Structure

```text
prompt-x/
  frontend/   Next.js app, UI components, hooks, API calls, frontend utilities, styles, and public assets
  backend/    Express API entrypoints, MongoDB models, services, routes, middleware, and tests
  docs/       Architecture notes and implementation checklists
```

## Getting Started

Install each app's dependencies:

```bash
cd frontend
pnpm install

cd ../backend
npm install
```

Run the frontend:

```bash
pnpm --dir frontend dev
```

Run the backend:

```bash
npm --prefix backend run dev
```

Run backend tests:

```bash
npm --prefix backend run test
```

## Docker (Without Redis)

Run the full stack with MongoDB, backend, and frontend:

```bash
docker compose up --build -d
```

Seed realistic demo data:

```bash
docker compose --profile seed run --rm seed
```

### Test Users (Seeded Data)

After seeding, you can sign up/login with these users (or create your own):

| Name | Email | Password |
| --- | --- | --- |
| Ethan Cole | `ethan.cole@promptx.local` | `PromptX@2026` |
| Maya Patel | `maya.patel@promptx.local` | `PromptX@2026` |
| Jordan Lee | `jordan.lee@promptx.local` | `PromptX@2026` |
| Priya Nair | `priya.nair@promptx.local` | `PromptX@2026` |
| Lucas Hart | `lucas.hart@promptx.local` | `PromptX@2026` |
| Noah Kim | `noah.kim@promptx.local` | `PromptX@2026` |

Stop the stack:

```bash
docker compose down
```

App URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## Environment

Backend environment variables live in `backend/.env`. Use `backend/.env.example` as the template for local setup.
