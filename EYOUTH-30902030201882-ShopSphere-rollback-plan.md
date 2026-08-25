# Rollback Plan — EYOUTH-30902030201882-ShopSphere

## Detection

UptimeRobot monitors `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health`. If it returns non-200 or the health status is missing, the release is considered failed.

**Alert indicators:**
- UptimeRobot sends email/SMS/webhook notification
- Health endpoint returns HTTP 500, 502, 503, 504, or times out
- Health endpoint response missing `status: "ok"`
- Frontend shows persistent errors after deployment

**Triage before rollback:**
- Check Vercel deployment logs for the current production deployment
- Confirm the failure is in the latest deployment, not an external dependency
- Verify the previous deployment was healthy before proceeding

## Recovery Steps

1. **Identify last working deployment**
   - Open the Vercel dashboard: https://vercel.com/hamobeka12345/eyouth-30902030201882-shopsphere-backend
   - Go to the **Deployments** tab
   - Find the last `Ready` deployment with a green checkmark before the failed one
   - Note the deployment timestamp and commit message

2. **Verify previous deployment health**
   - Open the candidate deployment in Vercel
   - Check its logs for errors
   - If possible, visit its preview URL to confirm core functionality works

3. **Restore previous version**
   - On the candidate deployment page, click **"Promote to Production"**
   - Wait for the promotion to complete (usually seconds)
   - The production URL will now serve the previous version

4. **Confirm rollback**
   - Check `https://eyouth-30902030201882-shopsphere-backend.vercel.app/api/health` returns `status: "ok"`
   - Verify the frontend loads correctly
   - Test critical flows: product listing, cart, checkout

## Fix Forward

1. **Stabilize production**
   - Do not deploy new code immediately after rollback
   - Let the previous stable version run while investigating

2. **Root cause analysis**
   - Review Vercel logs from the failed deployment
   - Check database migrations, environment variables, and external API changes
   - Identify the specific commit or change that caused the failure

3. **Fix and redeploy**
   - Create a fix branch from the last known good commit
   - Apply the minimal fix needed
   - Test locally and in a preview deployment
   - Merge to `main` only after verification
   - Monitor the health endpoint after deployment

4. **Update documentation**
   - Add the failure mode to this rollback plan if not already documented
   - Update any affected monitoring thresholds or checks
