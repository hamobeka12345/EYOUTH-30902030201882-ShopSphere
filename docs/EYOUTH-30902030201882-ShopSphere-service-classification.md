# Service Classification — ShopSphere

| Service | Classification | Reason |
|---|---|---|
| **Vercel (Frontend)** | PaaS / Edge Runtime | Hosts the React production build as static assets plus serverless functions at the edge for low latency. |
| **Vercel (Backend / API)** | Serverless Function | Runs the Express API as an auto-scaling serverless function with per-request billing and no long-running server. |
| **Vercel (Review Service)** | Serverless Function | Independent review microservice deployed as a separate Vercel function to isolate review workload from the main API. |
| **Supabase PostgreSQL** | Managed DBaaS | Fully managed PostgreSQL with built-in connection pooling, backups, and HTTPS endpoint; replaces local development database. |
| **Supabase Storage / Blob** | Managed Object Storage | Stores uploaded product images with public CDN URLs and automatic scaling. |
