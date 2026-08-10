# SEO Implementation Report

_Work started: 2026-08-09_

## Outcome status

Implementation is in progress. Repository-complete, deployment-complete, and account-complete
states are reported separately so a green build is not mistaken for live acquisition evidence.

| Layer | Status | Evidence |
| --- | --- | --- |
| Baseline and route inventory | Complete | `SEO_BASELINE.md` and `ROUTE_INDEXABILITY_MAP.md` record repository, live-host, route, metadata, deployment, and measurement evidence. |
| Canonical/indexability implementation | Pending | To be completed in checkpoint 2. |
| Acquisition surfaces/internal linking | Pending | To be completed in checkpoint 3. |
| GA4/Vercel measurement | Pending | To be completed in checkpoint 4. |
| Page experience/CWV lab audit | Pending | To be completed in checkpoint 5. |
| Production deployment and owner dashboards | Pending | Exact actions will remain listed even after repository completion. |

## Before findings

- Production serving host: `https://www.mikechaves.io`.
- Exact production Git SHA: `55c469779d2ccb2f4cad3b305a078c4203712955`.
- Twenty substantive routes return 200 and expose meaningful initial HTML.
- Nineteen of twenty substantive routes reuse the same title and description.
- Zero substantive routes expose canonical, Open Graph, Twitter, or JSON-LD metadata.
- `robots.txt` and `sitemap.xml` return 404.
- Unknown projects temporarily redirect to an indexable error page.
- Vercel Web Analytics is not enabled; GA4 and Speed Insights are absent.

Full evidence and limitations are in `SEO_BASELINE.md`.

## Changes made

_This section will be updated after each checkpoint._

1. Created the five required SEO/acquisition documents and established an evidence-backed
   canonical-origin, route-indexability, demand, measurement, and growth contract.

## Evidence

### Pre-change commands

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm test:unit --runInBand
pnpm check:links
pnpm build
pnpm type-check
```

Results: lint passed; 26 suites/169 tests passed; link/asset audit passed; production build passed;
type-check passed after synchronizing the frozen Playwright dependency.

### Live routes tested before implementation

```text
/
/about
/projects
/projects/{all 11 curated IDs}
/blog
/blog/{all 5 article IDs}
/archive
/error
/projects/does-not-exist
/robots.txt
/sitemap.xml
```

### Host behavior tested before implementation

```text
http://mikechaves.io/
https://mikechaves.io/
http://www.mikechaves.io/
https://www.mikechaves.io/
```

## Before-and-after findings

| Check | Before | After |
| --- | --- | --- |
| Curated sitemap | 404 | Pending |
| Production robots policy | 404 | Pending |
| Unique title/description | 1/20 | Pending |
| Self-referencing canonical | 0/20 | Pending |
| OG/Twitter preview metadata | 0/20 | Pending |
| Valid JSON-LD | 0/20 | Pending |
| Unknown project | 307 → 200 error | Pending |
| Automated SEO audit | None | Pending |
| GA4 conversion measurement | None | Pending |
| Vercel Speed Insights integration | None | Pending |
| Field CWV | Unavailable | Pending deployment/account evidence |

## Commands run

See the checkpoint evidence above. Final validation commands and results will be appended rather
than replacing failures or limitations.

## Remaining risks

- Search-volume and query evidence remain assumptions until Search Console records data.
- Search Console, GA4 property/stream configuration, Vercel Analytics dashboard enablement, and
  field Core Web Vitals are account/deployment state, not repository facts.
- Existing public article pages summarize content whose canonical full articles live on Medium;
  their unique summaries must remain useful enough to justify self-canonical indexation.
- The current HTTP apex redirect takes two hops before reaching the serving host.

## Exact manual owner actions

_These are provisional and will be verified after deployment._

1. Create or confirm a Google Search Console Domain property for `mikechaves.io` by adding the TXT
   record Google supplies at the DNS provider.
2. Submit `https://www.mikechaves.io/sitemap.xml` and inspect the representative URLs listed in the
   final report.
3. Create or select the GA4 web data stream for `https://www.mikechaves.io`, set
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel Production only, and verify the sanitized funnel in
   DebugView/Realtime after deployment.
4. Enable Vercel Web Analytics and Speed Insights for project `portfolio` if the account plan and
   allocation permit, then confirm production observations.
5. Optionally configure `http://mikechaves.io/*` to redirect directly to
   `https://www.mikechaves.io/*` at the domain/edge layer to remove the remaining two-hop HTTP apex
   chain.

## Recommended next PRs

1. Canonical/indexability foundation and automated regression protection.
2. Acquisition-surface and internal-link strengthening based on the demand map.
3. Privacy-safe GA4 plus Vercel performance measurement.

The active branch may combine these reviewable checkpoints into one final PR only after each slice
has its own verification evidence.
