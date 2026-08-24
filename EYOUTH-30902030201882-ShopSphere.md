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
## Production

- Frontend: https://frontend-lemon-zeta-43.vercel.app
- Backend: https://backend-iota-ashen-33.vercel.app
- Health: https://backend-iota-ashen-33.vercel.app/api/health

### Logs

Structured logs are emitted by the backend with `timestamp`, `level` (`INFO`/`WARN`/`ERROR`/`DEBUG`), and request/error metadata. In production, logs are read from the Vercel dashboard for each deployment (https://vercel.com/joumanakarimmoh-2965s-projects/eyouth-30902030201882-shopsphere-backend/logs).

## Monitoring

Production health is monitored via the backend health endpoint:
- `GET https://backend-iota-ashen-33.vercel.app/api/health`

This endpoint returns `status: "ok"` with a timestamp. Any non-200 response or absence of `ok` indicates a failed release.

## Rollback Plan

If a deployment to production fails or causes an outage, use the following steps to restore the previous working version:

1. **Detect failure**
   - Check the health endpoint. If it returns non-200 or errors, the release is unhealthy.
   - Review logs in the Vercel dashboard for error spikes or crash indicators.

2. **Identify last working deployment**
   - Go to the Vercel dashboard for the affected project.
   - Select the last deployment with `Ready` status before the failed one.

3. **Restore previous version**
   - In the Vercel dashboard, open the last working deployment.
   - Click **"Promote to Production"** to make it the active production version.

4. **Verify recovery**
   - Re-check the health endpoint until it returns `status: "ok"`.
   - Confirm the frontend loads and core flows (browse, login, cart) work.

5. **Fix forward**
   - Once production is stable, fix the issue in code.
   - Trigger a new pipeline run to deploy the corrected version.  
