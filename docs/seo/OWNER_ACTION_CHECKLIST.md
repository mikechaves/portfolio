# Organic Acquisition Owner Actions

_Prepared: 2026-08-09; production checkpoint: 2026-08-10_

This began as the post-merge owner runbook. The 2026-08-10 production checkpoint completed every
currently available account action and preserves the remaining asynchronous evidence gates.

## Production completion record — 2026-08-10

- Application release `538332858978d62aab196ec92b807134b2923bc7` reached Vercel `Ready` and
  served the canonical `https://www.mikechaves.io` aliases without deployment protection.
- The `mikechaves.io` Search Console Domain property was verified with a root DNS TXT record.
  `https://www.mikechaves.io/sitemap.xml` reports `Success` with 20 discovered pages.
- `/`, `/about`, and `/projects` are indexed. `/projects/x-games` and
  `/blog/voice-first-xr` are discovered but not yet indexed; one indexing request for each is in
  Google's crawl queue. Page-indexing data is still processing. Manual Actions and Security Issues
  both report `No issues detected`.
- Search Console reports insufficient 90-day field data for mobile and desktop Core Web Vitals.
  This is expected for the new property and is not replaced with Vercel Speed Insights.
- GA4 property `Portfolio Website`, stream `Portfolio`, uses measurement ID `G-QKNK9H37SE` from
  Vercel Production only. Enhanced Measurement is off. Unknown/denied consent sends no Google
  script; granted consent loads the correct tag and emits one sanitized in-memory `page_view` per
  pathname. Controlled QA browsers did not expose a Google collect request and GA4 Realtime still
  showed zero users, so received-event verification and key-event marking remain open.
- Vercel Web Analytics is active. Its authenticated seven-day dashboard showed 53 visitors, 91
  page views, and 62% bounce rate at the checkpoint. The account API still returned `404 Web
  Analytics not found`, so the authenticated dashboard is the evidence source.
- Speed Insights is intentionally disabled by owner direction. The component and dependency were
  removed, and a clean production trace contains Web Analytics traffic but no Speed Insights script
  or first-party vitals beacon.

## 1. Review, merge, and deploy

1. Push and review `mike/portfolio-organic-acquisition`.
2. Merge the reviewed head and confirm the Vercel Production deployment is `Ready` at that exact
   commit. A Preview or a deployment from another SHA is not release evidence.
3. Confirm the public custom domain serves `https://www.mikechaves.io` without a Vercel protection
   interstitial.
4. Re-run `pnpm seo:audit`, `pnpm analytics:audit`, and `pnpm performance:audit` on the reviewed
   head if it changes during review.

## 2. Verify the live search surface

1. Check `https://www.mikechaves.io/robots.txt` and
   `https://www.mikechaves.io/sitemap.xml` after deployment.
2. Confirm `http://mikechaves.io`, `https://mikechaves.io`, and
   `http://www.mikechaves.io` preserve the path/query while converging on the canonical HTTPS `www`
   host. The existing HTTP apex route may take two hops; optionally correct that at the domain/edge
   layer.
3. Inspect `/`, `/about`, `/projects`, `/projects/x-games`, and `/blog/voice-first-xr` in Google's
   Rich Results Test or Schema Markup Validator. A valid repository parse is not proof of Google
   eligibility or display.

## 3. Connect Google Search Console

1. Create or confirm the Domain property for `mikechaves.io` and add the exact TXT verification
   record Google provides at the DNS provider. Alternatively, set `GOOGLE_SITE_VERIFICATION` in
   Vercel Production if using the URL-prefix verification path.
2. Submit `https://www.mikechaves.io/sitemap.xml`.
3. Use URL Inspection on `/`, `/about`, `/projects`, `/projects/x-games`, and
   `/blog/voice-first-xr`; record discovered/indexed status and any selected-canonical difference.
4. Do not request indexing for utility, error, API, preview, private, thin, or duplicate routes.
5. Review Page indexing, Search performance, Core Web Vitals, structured-data/enhancement reports,
   Security issues, and Manual actions on the cadence in `90_DAY_ORGANIC_PLAN.md`. When Google
   exposes evidence for AI Overviews, AI Mode, or other generative-search source visibility, record
   it separately; do not infer or promise inclusion when the data is unavailable.

### DNS TXT walkthrough

For the preferred Domain-property path, the verification value comes from Search Console—not GA4:

1. In Search Console, choose **Add property**, select **Domain**, and enter `mikechaves.io` without
   `https://` or a path.
2. Copy the complete value beginning `google-site-verification=`.
3. In the authoritative DNS zone, choose **Add standard record**, set the name/host to the zone root
   (`mikechaves.io.` or `@`, depending on the provider), select `TXT`, and paste the complete value
   as the record data. Keep the default TTL unless the provider requires another value.
4. Save the record, confirm a public TXT lookup returns it, then return to Search Console and choose
   **Verify**. Keep the record after verification so ownership remains valid.

The production record was added and publicly resolved on 2026-08-10; no GA4 value belongs in DNS.

## 4. Connect and verify GA4

1. Create or select the GA4 web stream for `https://www.mikechaves.io`.
2. Set its valid `G-…` identifier as `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel Production only.
   Leave Preview and Development unset.
3. Deploy the environment change. In a controlled production browser, verify that unknown/denied
   consent, Global Privacy Control, and Do Not Track send no Google requests.
4. Grant optional analytics and verify one query-free canonical `page_view` per pathname plus
   `adaptive_focus_started`, `adaptive_focus_completed`, `select_content`, `share`, and successful
   contact `generate_lead` behavior in Realtime/DebugView. Do not enter private role text or real
   contact content during QA.
5. Mark only `adaptive_focus_completed` and `generate_lead` as GA4 key events initially.

Steps 4–5 remain gated on GA4 receiving the first real opted-in event. After that happens, confirm
the event names in Realtime or DebugView and mark only those two events as key events.

## 5. Use Vercel Web Analytics and collect field data

1. Confirm Web Analytics for Vercel project `portfolio` from the authenticated production dashboard;
   the account API may still return `404 Web Analytics not found` despite dashboard data.
2. Do not enable Vercel Speed Insights. The owner opted out on 2026-08-10, and the SDK integration
   was removed after a production trace exposed its first-party vitals beacon.
3. Confirm production observations in Web Analytics; Preview and local traffic should remain absent
   by design.
4. After at least 28 days or sufficient real-user samples, record p75 LCP, INP, and CLS from Search
   Console's Core Web Vitals report or another approved field source for the five route groups in
   `PAGE_EXPERIENCE_AUDIT.md`. The production targets are LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1.

## 6. Establish the acquisition baseline

Record Search Console indexed pages/impressions/clicks, GA4 organic landing-page sessions and
bounded conversions, and Vercel field CWV before making another conversion redesign. Follow
`90_DAY_ORGANIC_PLAN.md`; do not publish traffic-growth claims until the date range and baseline are
stable.
