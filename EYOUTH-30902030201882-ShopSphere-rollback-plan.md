# Rollback Plan — EYOUTH-30902030201882-ShopSphere

## Detection

UptimeRobot monitors `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health`. A non-200 response or missing `status: "ok"` means the release failed. Alerts come via email/SMS/webhook from UptimeRobot.

Before rolling back: check Vercel logs for the current deployment, confirm the failure is in the latest release, and verify the previous deployment was healthy.

## Recovery

1. Open the Vercel dashboard for the backend project.
2. In **Deployments**, find the last `Ready` deployment before the failed one.
3. Open it and click **"Promote to Production"**.
4. Verify `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health` returns `status: "ok"` and the frontend loads correctly.

## Fix Forward

Investigate the root cause from Vercel logs, apply a minimal fix on a branch from the last good commit, test locally and in preview, then merge to `main` only after verification. Update this plan with the failure mode if needed.
