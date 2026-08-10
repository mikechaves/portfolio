# SEO Implementation Report

_Work started: 2026-08-09_

## Outcome status

Implementation is in progress. Repository-complete, deployment-complete, and account-complete
states are reported separately so a green build is not mistaken for live acquisition evidence.

| Layer | Status | Evidence |
| --- | --- | --- |
| Baseline and route inventory | Complete | `SEO_BASELINE.md` and `ROUTE_INDEXABILITY_MAP.md` record repository, live-host, route, metadata, deployment, and measurement evidence. |
| Canonical/indexability implementation | Complete | Production-build audit passes all 20 sitemap routes in initial HTML, hydrated desktop, and representative mobile output. |
| Acquisition surfaces/internal linking | Complete | Every indexable route has an initial-HTML inbound link; all project and writing paths expose contextual next actions. |
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
2. Added one canonical configuration layer that rejects HTTP, localhost, and Vercel deployment
   URLs as metadata origins and defaults to `https://www.mikechaves.io`.
3. Added unique titles/descriptions, self-canonicals, Open Graph and Twitter metadata, a branded
   site social card, article-specific social cards, and deployment-aware robots directives.
4. Added curated `robots.txt` and `sitemap.xml` App Router routes. Preview builds publish an empty
   sitemap and disallow crawling; production exposes exactly 20 substantive URLs.
5. Statically generated all current project IDs, retained four approved retired-ID redirects, and
   changed unknown project IDs from a temporary redirect/indexable error to a real 404.
6. Added accurate `Person`, `WebSite`, `ProfilePage`, `CollectionPage`, `CreativeWork`,
   `BreadcrumbList`, and `Article` JSON-LD using only visible public records.
7. Added canonical-host middleware that preserves path/query information for known aliases and
   applies `X-Robots-Tag: noindex, nofollow` to preview Vercel hosts. API responses also receive the
   noindex header.
8. Added `pnpm seo:audit` and CI coverage for status, unique metadata, canonicals, H1, robots,
   sitemap, internal links, social media, alt attributes, schema syntax/required types, preview and
   localhost leakage, duplicate metadata, query variants, unknown routes, initial HTML, hydrated
   desktop output, and representative mobile output.
9. Replaced broken SVG placeholder previews on all five article-summary pages with allowlisted PNG
   image responses. The production-like browser had correctly exposed Next Image 400 responses.
10. Isolated the portfolio visual suite on port 3199 with server reuse disabled after the first
    run attached to an unrelated Playfold server already using port 3100.
11. Added a problem-based project directory that gives all eleven curated cases a useful,
    initial-HTML entrance even when the interactive archive initially displays six cards.
12. Changed blog cards from outbound-only Medium links to on-site summaries, expanded all five
    summaries into substantive resources, and linked each one to at least two directly relevant
    project cases plus the original article.
13. Added visible breadcrumbs to articles and project dossiers, bidirectional relationships between
    writing and evidence, and clear project-hub/contact continuations.
14. Added a canonical case-study share action with native-share and clipboard paths. Only a bounded
    success event is emitted; cancellations and unavailable browser APIs do not interrupt reading.
15. Extended every project exit path to include related evidence, relevant writing where available,
    Adaptive Focus, contact, and resume actions.
16. Strengthened `pnpm seo:audit` so every sitemap URL except the root must receive a crawlable link
    from another indexable page. The audit also requires project/article breadcrumbs, project share,
    article evidence links, and original-article actions in initial HTML.

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

### Checkpoint 2 commands

```text
pnpm type-check
pnpm lint
pnpm test:unit --runInBand
pnpm seo:audit
pnpm check:links
pnpm test
pnpm test:visual-smoke
```

Results:

- type-check and lint passed;
- 30 suites and 184 unit/integration tests passed;
- the link/asset audit passed with 183 assets, 148 internal route references, 77 external/mailto
  references, and all five required contact/social/resume links;
- the production build generated 33 route entries, including 15 statically generated project
  paths, robots, sitemap, and social-image endpoints;
- all four SEO browser/audit scenarios passed across the 20-url sitemap;
- all 34 existing desktop/mobile visual-smoke scenarios passed on a fresh portfolio server.

Preserved failure evidence:

- The first SEO audit run exposed test-only root-slash/order assumptions; after normalizing those,
  it exposed a real 400 response for SVG placeholder images on article summaries. The image defect
  was fixed rather than excluded from console checks.
- The first visual-smoke run attached to a pre-existing Playfold Next 16 process on port 3100 and
  produced 32 cross-project failures. The process was left untouched; the portfolio suite now uses
  a dedicated port and refuses reuse, after which all 34 checks passed.

### Checkpoint 3 commands

```text
pnpm type-check
pnpm lint
pnpm test:unit --runInBand
pnpm seo:audit
pnpm test:visual-smoke
pnpm check:links
pnpm build
```

Results:

- type-check and lint passed;
- 31 suites and 188 tests passed, including relationship integrity and bounded share analytics;
- all four production-build SEO scenarios passed, including the full 20-route inbound-link graph;
- all 34 desktop/mobile visual-smoke scenarios passed;
- the link/asset audit passed with 183 assets, 151 internal route references, 77 external/mailto
  references, and all five required contact/social/resume links;
- fresh production screenshots of `/projects` at 1440 pixels and `/blog/voice-first-xr` at 390
  pixels confirmed readable hierarchy, no overflow, contextual paths, and preserved visual identity.

Preserved failure evidence:

- A screenshot attempt started `next start` after the visual suite had generated Turbopack dev
  artifacts in `.next`; Next reported mixed Webpack/Turbopack bindings. A fresh production build
  restored the correct artifact boundary, and the clean production screenshot pass succeeded.
- The first dev screenshot used `127.0.0.1` and exposed Next's future `allowedDevOrigins` warning.
  The final visual evidence uses a clean production server at `localhost`; no configuration was
  added for a test-only origin warning.

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
| Curated sitemap | 404 | 20 canonical, public, substantive URLs; all return 200 in the production build |
| Production robots policy | 404 | Allows public pages, disallows APIs/error utility, references canonical sitemap, leaves rendering assets crawlable |
| Unique title/description | 1/20 | 20/20 unique |
| Self-referencing canonical | 0/20 | 20/20; query variants canonicalize to the pathname |
| OG/Twitter preview metadata | 0/20 | 20/20 with loadable branded, project, or article-specific images |
| Valid JSON-LD | 0/20 | 20/20 parse; each added type has required-field assertions |
| Unknown project | 307 → 200 error | 404 with a useful recovery page |
| Automated SEO audit | None | `pnpm seo:audit`; four production-build browser scenarios plus CI gate |
| Crawlable inbound path | Article summaries were bypassed by outbound cards; five projects depended on a client-side “See More” interaction | All 19 non-root sitemap URLs receive an initial-HTML link from another indexable route |
| Article-to-evidence path | None | Five substantive summaries each link to at least two contextual project cases and retain a labeled original-article action |
| Project next actions | Uneven across templates | Breadcrumb, share, related evidence/writing, Role Fit, contact, and resume paths across all 11 cases |
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
