# Rollback Plan — EYOUTH-30902030201882-ShopSphere

## Monitoring

Production health is monitored via the backend health endpoint:
- `GET https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health`

This endpoint returns `status: "ok"` with a timestamp. Any non-200 response or absence of `ok` indicates a failed release.

Logs are emitted by the backend with `timestamp`, `level` (`INFO`/`WARN`/`ERROR`/`DEBUG`), and request/error metadata. In production, logs are read from the Vercel dashboard for each deployment (https://vercel.com/hamobeka12345/eyouth-30902030201882-shopsphere-backend/logs).

## Detection

UptimeRobot monitors `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health`. If it returns non-200 or the health status is missing, the release is considered failed.

## Recovery Steps

1. **Identify last working deployment**
   - Open the Vercel dashboard.
   - Select the last `Ready` deployment before the failed one.

2. **Restore previous version**
   - Open that deployment.
   - Click **"Promote to Production"**.

3. **Verify recovery**
   - Re-check the health endpoint until it returns `status: "ok"`.
   - Confirm the frontend loads and core flows work.

## Fix Forward

Once production is stable, fix the issue in code and trigger a new pipeline run to deploy the corrected version.
