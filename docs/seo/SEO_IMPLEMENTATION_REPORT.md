# SEO Implementation Report

_Work started: 2026-08-09; repository implementation completed: 2026-08-09_

## Outcome status

Repository implementation is complete on `mike/portfolio-organic-acquisition`. Deployment-complete
and account-complete states remain separate so a green build is not mistaken for live acquisition
evidence.

| Layer | Status | Evidence |
| --- | --- | --- |
| Baseline and route inventory | Complete | `SEO_BASELINE.md` and `ROUTE_INDEXABILITY_MAP.md` record repository, live-host, route, metadata, deployment, and measurement evidence. |
| Canonical/indexability implementation | Complete | Production-build audit passes all 20 sitemap routes in initial HTML, hydrated desktop, and representative mobile output. |
| Acquisition surfaces/internal linking | Complete | Every indexable route has an initial-HTML inbound link; all project and writing paths expose contextual next actions. |
| GA4/Vercel measurement | Repository complete; account verification pending | Consent-gated GA4, production-only Vercel Web Analytics, bounded event mapping, and a zero-transport debug audit are implemented. Speed Insights is intentionally disabled by owner direction. |
| Page experience/CWV lab audit | Complete | All ten mobile/desktop Lighthouse checks pass the LCP, CLS, and TBT budgets; field INP remains deployment-dependent. |
| Production deployment and owner dashboards | Owner action pending | `OWNER_ACTION_CHECKLIST.md` preserves exact release, Search Console, GA4, Vercel, and field-CWV steps. |

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

This is the final repository-complete change inventory. Deployment/account state remains separate.

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
17. Added optional-consent GA4 with a validated environment measurement ID, manual deduplicated
    pathname pageviews, canonical query-free locations, stable page groups, advertising signals
    disabled, and Global Privacy Control/Do Not Track support.
18. Preserved Vercel Web Analytics as a documented production-only aggregate cross-check. The
    initially integrated Speed Insights component was removed by owner direction after a live trace
    exposed its first-party vitals beacon. Vercel transport does not run locally, in tests, or on
    Preview deployments.
19. Mapped successful contact to GA4's recommended `generate_lead`, successful case sharing to
    `share`, project/article selections to `select_content`, and kept Adaptive Focus plus meaningful
    failure states as product-specific events.
20. Added a footer preferences control, consent revocation/cookie cleanup, a bounded original-article
    event, and categorized contact failures without transmitting contact contents or provider error
    text.
21. Added `pnpm analytics:audit`, a local in-memory GA4-shaped debug buffer, CI coverage, and tests
    that fail on any Google or Vercel provider request from the debug build.
22. Replaced the older Vercel-only analytics decision with an explicit provider/environment/event
    contract. Signup/waitlist completion is recorded as not applicable because that product flow
    does not exist; the actual contact conversion is not relabeled as a signup.
23. Replaced the 1.7 MB homepage signal-grid PNG with an 82 kB WebP on desktop and a transfer-free
    CSS treatment on mobile. The original asset remains available as source evidence but is no
    longer requested by the page.
24. Preserved the server-rendered homepage while moving decorative Three.js/WebGL behind a
    desktop-only idle boundary. Mobile and reduced-motion clients do not download that path.
25. Replaced hosted font requests with system stacks, removed the Font Awesome runtime/stylesheet,
    and kept the two X glyphs as a local inline SVG.
26. Replaced the JavaScript-heavy route animation with a reduced-motion-safe CSS transition that
    runs only on actual client-side pathname changes.
27. Split About, Projects, dossier exit paths, the media lightbox, Role Fit details, and Adaptive
    Focus execution along real interaction boundaries while keeping primary page meaning in initial
    HTML.
28. Added a compact public project index, plus synchronization coverage, so the archive does not
    hydrate the full 63 kB evidence dataset.
29. Disabled automatic prefetch on persistent and above-fold navigation where it caused unrelated
    route chunks to enter the initial trace, and deferred below-the-fold/supporting media with
    stable dimensions.
30. Added `pnpm performance:audit`, Lighthouse 12.8.2, CI enforcement, ten JSON evidence outputs
    retained as CI artifacts, and explicit LCP ≤ 2.5 s, CLS ≤ 0.1, and lab TBT ≤ 200 ms budgets.
31. Added the before/after `PAGE_EXPERIENCE_AUDIT.md` and a separate
    `OWNER_ACTION_CHECKLIST.md`, preserving the boundary between repository proof, release proof,
    account enablement, and field evidence.

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

### Checkpoint 4 commands

```text
pnpm type-check
pnpm lint
pnpm test:unit --runInBand
pnpm analytics:audit
pnpm seo:audit
pnpm test:visual-smoke
pnpm check:links
```

Results:

- type-check and lint passed;
- 33 suites and 194 tests passed;
- both analytics browser scenarios passed, covering allow, decline, persistence, preference
  reopening, one pageview per pathname, Adaptive Focus start, sharing, and zero provider requests;
- all four production SEO scenarios and all 34 intended desktop/mobile visual-smoke scenarios
  passed after instrumentation;
- the link/asset audit passed with 183 assets, 160 internal route references, 78 external/mailto
  references, and all five required contact/social/resume links;
- 1440-pixel desktop and 390-pixel mobile debug screenshots confirmed that consent choices remain
  readable, dismissible, and consistent with the existing visual system without horizontal overflow;
- a fresh Vercel Web Analytics query for project `portfolio`
  (`prj_EF0vBdY7B8QOPhJM03gtO2ozDEuM`) still returned 404 `Web Analytics not found`, confirming that
  dashboard/account enablement remains an owner action rather than a repository-complete claim.

Preserved failure evidence:

- The first general visual-smoke run discovered the new `e2e/analytics` specs under its broad
  `e2e` test directory. That suite intentionally builds without analytics debug mode, so the two
  consent-fixture checks failed and the run was stopped. The general config now ignores the isolated
  analytics and SEO directories; each specialized contract runs through its own explicit command.

### Checkpoint 5 command

```text
pnpm performance:audit
```

Results:

- all ten Lighthouse 12.8.2 audits passed the checked budgets across Home, About, Projects, one
  project dossier, and one article summary in standard mobile and desktop profiles;
- mobile LCP is 2,087–2,483 ms, CLS is 0, and TBT is 3–15 ms;
- desktop LCP is 479–644 ms, CLS is 0–0.002, and TBT is 0 ms;
- the homepage improved from 13,435 to 2,483 ms mobile LCP and from 2,333 to 238 kB mobile transfer;
- the production build now reports 129 kB first-load JavaScript for Home, 121 kB for About, 140 kB
  for Projects, 131 kB for a project dossier, and 111 kB for an article summary.

`PAGE_EXPERIENCE_AUDIT.md` contains the full before/after matrix and methodology. TBT is recorded as
the repeatable lab responsiveness proxy; only post-deployment field data can establish INP.

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
| GA4 conversion measurement | None | Repository-complete consent, pageview, funnel, recommended-event, privacy, and debug contract; production ID/account verification pending |
| Vercel Web Analytics | SDK present but account API returned `Web Analytics not found` | Production-only SDK/custom events retained; dashboard enablement and production observation pending owner action |
| Vercel Speed Insights integration | None | Intentionally disabled; SDK component and dependency removed by owner direction |
| Field CWV | Unavailable | Pending Search Console Core Web Vitals or another approved field source after sufficient traffic |
| Representative mobile lab performance | Home LCP 13,435 ms/TBT 921 ms/2,333 kB; other template LCPs 3,135–3,606 ms | All five templates pass: LCP 2,087–2,483 ms, CLS 0, TBT 3–15 ms |
| Representative desktop lab performance | Home score 88/LCP 2,367 ms/2,369 kB | All five templates pass: score 100, LCP 479–644 ms, CLS 0–0.002, TBT 0 ms |
| Performance regression gate | None | `pnpm performance:audit`; ten Lighthouse reports plus a summary, enforced in CI |

## Commands run

Final application validation on page-experience commit `756117e`; the remaining handoff and
CI-artifact diff was checked separately:

```text
pnpm lint
pnpm type-check
pnpm test
pnpm check:links
pnpm check:links -- --check-external
pnpm seo:audit
pnpm analytics:audit
pnpm performance:audit
pnpm test:visual-smoke
git diff --check
```

Results:

- lint and explicit type checking passed;
- all 33 Jest suites and 194 tests passed;
- the link/asset audit passed with 194 local/public assets, 171 internal route references, 84
  external/mailto references, and all five required contact/social/resume links;
- optional live HTTP checking reached 36 of 42 unique external references successfully. The six
  non-strict warnings are preserved: the not-yet-deployed production sitemap and robots routes
  return 404, and four documentation-only `/*` route patterns are not literal URLs;
- all four production-build SEO scenarios passed over the 20-URL sitemap contract;
- both analytics scenarios passed with consent/funnel behavior and zero Google or Vercel provider
  requests from the debug build;
- all ten Lighthouse checks passed the LCP, CLS, and TBT budgets;
- all 36 desktop/mobile visual and interaction checks passed, including the dynamically loaded
  Role Fit result focus and first-activation media lightbox;
- fresh Home and Projects screenshots at 1440-pixel desktop and 390-pixel mobile widths were
  inspected for hierarchy, typography, fallback art, footer icons, and overflow.
- the final handoff/CI diff passed the link/asset audit and `git diff --check`.

The visual development server continues to emit the pre-existing optional
`@react-email/render`/Prettier external-resolution warning. No scenario fails, the production builds
complete, and this work did not hide or relabel the warning.

## Remaining risks

- Search-volume and query evidence remain assumptions until Search Console records data.
- Search Console, GA4 property/stream configuration, Vercel Analytics dashboard enablement, and
  field Core Web Vitals are account/deployment state, not repository facts.
- Existing public article pages summarize content whose canonical full articles live on Medium;
  their unique summaries must remain useful enough to justify self-canonical indexation.
- The current HTTP apex redirect takes two hops before reaching the serving host.
- Lighthouse is controlled lab evidence and can vary by environment. It does not establish field
  LCP/CLS or INP, ranking improvement, traffic, or conversion lift.

## Exact manual owner actions

The complete, ordered handoff is in `OWNER_ACTION_CHECKLIST.md`. In summary:

1. Create or confirm a Google Search Console Domain property for `mikechaves.io` by adding the TXT
   record Google supplies at the DNS provider.
2. Submit `https://www.mikechaves.io/sitemap.xml` and inspect the representative URLs listed in the
   final report.
3. Create or select the GA4 web data stream for `https://www.mikechaves.io`, set
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel Production only, and verify the sanitized funnel in
   DebugView/Realtime after deployment.
4. Confirm Vercel Web Analytics production observations. Keep Speed Insights disabled and use
   Search Console Core Web Vitals or another approved field source instead.
5. Optionally configure `http://mikechaves.io/*` to redirect directly to
   `https://www.mikechaves.io/*` at the domain/edge layer to remove the remaining two-hop HTTP apex
   chain.
6. Push/review/merge the completed branch, deploy its exact reviewed SHA, and collect the first
   Search Console, GA4, Web Analytics, and p75 field-CWV evidence without relabeling repository
   checks as production proof.

## Reviewable checkpoint history

The active branch preserves separate commits for the baseline/demand contract, search foundation,
acquisition paths, privacy-safe measurement, and page experience. This final handoff records the
green cross-cutting validation matrix. No production deployment, provider account, DNS, or Search
Console mutation is claimed by this report.

## Recommended next PRs

No additional implementation PR is justified before the external owner actions produce evidence.
After that:

1. Open a production-verification evidence PR recording the exact deployed SHA, live canonical
   crawl, Search Console sitemap/inspection status, and provider-dashboard observations. Change
   application code only if the live evidence identifies a reproducible defect.
2. After at least 30 days or 100 qualified visits, open a baseline-evidence PR with dated Search
   Console query/page, GA4 funnel, and Vercel field-CWV observations; do not turn directional data
   into traffic or hiring-outcome claims.
3. Open a narrowly scoped field-performance correction PR only if p75 route-group evidence misses
   LCP, INP, or CLS targets. Preserve the current lab baseline and the route/device diagnosis.
