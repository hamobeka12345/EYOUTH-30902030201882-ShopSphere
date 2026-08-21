# E-Commerce Platform

Full-stack e-commerce app: Vite + React frontend, Express + Prisma backend, PostgreSQL.

## Structure

- `backend/` — Express API (Prisma, JWT auth, Multer uploads)
- `frontend/` — Vite + React app
- `prisma/` — schema and migrations

## Setup

```bash
npm install            # root (concurrently + prisma)
cd backend && npm install
cd ../frontend && npm install
```

Make a `.env` at the repo root (see `.env.example`) with `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

Run locally (needs a running PostgreSQL):

```bash
cd backend
npx prisma migrate deploy
npm run seed
npm run dev

cd frontend
npm run dev
```

Or with Docker: `docker compose up --build`. Frontend on :3000, API on :5000.

## Tests

```bash
cd backend && npm test      # Jest + Supertest
cd frontend && npm test     # Vitest + RTL
```
" "  
