# Architecture Decision Record — ShopSphere

**Student:** EYOUTH-30902030201882  
**Date:** 2026-08-21  
**Status:** Accepted

---

## 1. Extracted Microservice: Review Service

**What was moved:** The reviews feature was removed from the main backend and placed into its own standalone service.

**Why:** Reviews have their own data model and do not depend on products, cart, or auth. Separating them allows the review service to scale independently, fail without taking down the main app, and be updated without redeploying the entire backend.

**Result:** The review service runs at `https://review-service-eight.vercel.app`. The main backend proxies review requests through `/api/reviews/*`. The frontend is unaware of the change and continues calling the same `/api/reviews` paths.

---

## 2. Serverless Workload: Daily Summary Cron

**What was moved:** The daily background job that collects product statistics, pricing, and review counts was moved from the main backend to a serverless function.

**Why:** The job runs once per day for a short duration. Serverless is cost-effective because there is no always-on server to pay for. The task is stateless and fits naturally into a scheduled function.

**Result:** The function is deployed on Vercel and triggered daily via Vercel Cron at `/api/cron/daily-summary`. It runs separately from user requests and does not compete for resources during peak traffic.

**Review section role:** The review section in the frontend displays submitted reviews on each product page and allows authenticated users to submit new reviews. It calls `/api/reviews/:id` on the backend, which proxies requests to the standalone review service. This keeps review traffic separate from the main product and cart workflows.

---

## 3. Reasons Behind Both Decisions

Both the review service extraction and the cron job move share the same goal: improve the main application's reliability and resource usage.

- The review service was extracted because review traffic is independent and could overwhelm the main API if kept together. Isolating it prevents one feature from affecting the whole system.

- The daily cron was moved to serverless because it is a periodic, lightweight task that does not need a dedicated server. Running it on serverless reduces cost and eliminates background work from competing with user-facing requests.

Together, these changes make the main backend more focused, more resilient, and easier to maintain.
