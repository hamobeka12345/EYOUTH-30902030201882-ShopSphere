# Monitoring — EYOUTH-30902030201882-ShopSphere

Production health is monitored via the backend health endpoint:
- `GET https://eyouth-30902030201882-shopsphere-ba.vercel.app/api/health`

This endpoint returns `status: "ok"` with a timestamp. Any non-200 response or absence of `ok` indicates a failed release.

Logs are emitted by the backend with `timestamp`, `level` (`INFO`/`WARN`/`ERROR`/`DEBUG`), and request/error metadata. In production, logs are read from the Vercel dashboard for each deployment (https://vercel.com/hamobeka12345/eyouth-30902030201882-shopsphere-backend/logs).
