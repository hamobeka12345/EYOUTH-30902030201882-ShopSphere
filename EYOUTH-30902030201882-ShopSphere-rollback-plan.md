# Rollback Plan — EYOUTH-30902030201882-ShopSphere

## Detection

UptimeRobot monitors `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health`. A non-200 response or missing `status: "ok"` means the release failed. UptimeRobot sends email/SMS/webhook alerts when the endpoint goes down.

Before rolling back: check Vercel logs for the current deployment, confirm the failure is in the latest release, and verify the previous deployment was healthy.

## Recovery

1. Open the Vercel dashboard: https://vercel.com/hamobeka12345/eyouth-30902030201882-shopsphere-backend
2. Go to **Deployments** and find the last `Ready` deployment with a green checkmark before the failed one.
3. Note its timestamp and commit message, then open that deployment.
4. Check its logs for errors and visit its preview URL to confirm core functionality works.
5. Click **"Promote to Production"** and wait for promotion to complete.
6. Verify `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health` returns `status: "ok"`.
7. Confirm the frontend loads correctly and test critical flows: product listing, cart, checkout.
8. If the promoted deployment also fails, repeat from step 2 with the next previous deployment.

## Fix Forward

Investigate the root cause from Vercel logs, apply a minimal fix on a branch from the last good commit, test locally and in preview, then merge to `main` only after verification. Update this plan with the failure mode if needed.
