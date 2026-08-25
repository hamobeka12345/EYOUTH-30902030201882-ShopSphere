# Architecture Decision Record — ShopSphere

**Student:** EYOUTH-30902030201882  
**Date:** 2026-08-25  
**Status:** Accepted

---

## 1. Extracted Microservice: Review Service

**What was moved:** The reviews feature was removed from the main backend and placed into its own standalone service.

**Why:** Reviews have their own data model and do not depend on products, cart, or auth. Separating them allows the review service to scale independently, fail without taking down the main app, and be updated without redeploying the entire backend.

**Result:** The review service runs at `https://eyouth-30902030201882-shopsphere-re-nine.vercel.app`. The frontend calls it directly via `reviewService.js` using REST endpoints (`/products/:productId/reviews`). The main backend is unaffected by review traffic.

---

## 2. Serverless Workload: Review Service

**What was moved:** The review API was deployed as a Vercel serverless function instead of running inside the main Express backend.

**Why:** Review traffic is independent from the main product, cart, and auth workflows. Serverless execution lets the review service scale per-request without reserving always-on infrastructure, and failures remain isolated from the main application.

**Result:** The function is deployed on Vercel at `https://eyouth-30902030201882-shopsphere-re-nine.vercel.app`. It executes on demand, outside the main application, and persists reviews to Supabase via the REST API.

---

## 3. Reasons Behind Both Decisions

Both the review service extraction and the serverless deployment share the same goal: improve the main application's reliability and resource usage.

- The review service was extracted because review traffic is independent and could overwhelm the main API if kept together. Isolating it prevents one feature from affecting the whole system.

- The review workload was moved to serverless because it is lightweight, request-driven, and does not need a dedicated server. Running it on Vercel reduces cost and keeps background review work from competing with user-facing requests.

Together, these changes make the main backend more focused, more resilient, and easier to maintain.
