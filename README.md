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

## Environment

Backend environment variables live in `backend/.env`. Use `backend/.env.example` as the template for local setup.
