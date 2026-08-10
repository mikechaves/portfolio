# Organic Acquisition Owner Actions

_Prepared: 2026-08-09_

Repository implementation and local verification do not mutate production, DNS, or provider
accounts. Complete these actions after review; record the exact deployment SHA and date with every
dashboard observation.

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
