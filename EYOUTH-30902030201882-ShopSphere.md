# EYOUTH-30902030201882-ShopSphere

## Project Summary

ShopSphere is a full-stack e-commerce platform built with Vite + React frontend, Express + Prisma backend, and PostgreSQL on Supabase. The review feature is extracted into an independent serverless microservice deployed on Vercel, communicating with the frontend via REST. The project includes CI/CD automation, structured logging, health monitoring with UptimeRobot, and a documented rollback plan.

## Links

- **Application:** https://eyouth-30902030201882-shopsphere-frontend.vercel.app
- **Review Service:** https://eyouth-30902030201882-shopsphere-review-service.vercel.app
- **Repository:** https://github.com/hamobeka12345/EYOUTH-30902030201882-ShopSphere
- **Pipeline:** https://github.com/hamobeka12345/EYOUTH-30902030201882-ShopSphere/actions
- **Backend:** https://eyouth-30902030201882-shopsphere-backend.vercel.app
- **Health:** https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health
- **UptimeRobot Status:** https://stats.uptimerobot.com/Y19DNZdVWI

## Documentation

- **EYOUTH-30902030201882-ShopSphere.md** — Main project documentation with setup instructions, production URLs, and project links.
- **EYOUTH-30902030201882-ShopSphere-rollback-plan.md** — Step-by-step rollback procedure for failed releases, triggered by UptimeRobot monitoring.
- **EYOUTH-30902030201882-ShopSphere-Structured-Logging.md** — Monitoring details including health endpoint behavior and where production logs are read.
- **EYOUTH-30902030201882-ShopSphere-service-classification.md** — Cloud service classifications for frontend, backend, and database with one-line reasons.
- **EYOUTH-30902030201882-ShopSphere-ADR.md** — Architecture Decision Record covering review service extraction and serverless deployment rationale.
- **EYOUTH-30902030201882-ShopSphere-project-links.md** — Dedicated document holding the application, review service, and repository URLs.
- **EYOUTH-30902030201882-ShopSphere.svg** — Architecture diagram showing the frontend, backend, database, and traffic paths.

## Instructions and Installation

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

Create a `.env` at the repo root with `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

```bash
cd backend
npx prisma migrate deploy
npm run seed
npm run dev

cd frontend
npm run dev
```

Or with Docker: `docker compose up --build`. Frontend on :3000, API on :5000.
