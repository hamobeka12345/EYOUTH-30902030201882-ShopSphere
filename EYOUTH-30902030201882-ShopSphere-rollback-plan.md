# Rollback Plan — EYOUTH-30902030201882-ShopSphere

## Detection

UptimeRobot monitors `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health` every few minutes. A non-200 response, timeout, or missing `status: "ok"` means the release failed. UptimeRobot sends alerts via email, SMS, or webhook when the endpoint goes down.

Public monitoring status page: https://stats.uptimerobot.com/Y19DNZdVWI

Before rolling back: check Vercel logs for the current production deployment, confirm the failure originated in the latest release, and verify the previous deployment was healthy.

## Recovery

1. Open the Vercel dashboard for the backend project.
2. Go to **Deployments** and find the last `Ready` deployment with a green checkmark before the failed one.
3. Note its timestamp and commit message, then open that deployment.
4. Check its logs for errors and visit its preview URL to confirm core functionality works.
5. Click **"Promote to Production"** and wait for promotion to complete.
6. Verify `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health` returns `status: "ok"`.
7. Confirm the frontend loads correctly and test critical flows: product listing, cart, checkout.
8. If the promoted deployment also fails, repeat from step 2 with the next previous deployment.
