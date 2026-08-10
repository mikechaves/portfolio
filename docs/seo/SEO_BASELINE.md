# SEO Baseline

_Checkpoint date: 2026-08-09 (America/Los_Angeles)_

## Executive summary

This repository is a Next.js 15 App Router portfolio for Mike Chaves. It is not an
authenticated SaaS application. Its public job is to help hiring managers, product and design
leaders, founders, and potential collaborators evaluate Mike's fit for AI-native product,
game, workflow, and immersive-interface work through reviewed evidence.

The production deployment is healthy and substantive content is present in initial HTML, but
the site does not yet provide the controls search engines need to understand or consolidate that
content. The most important baseline defects are:

- `robots.txt` and `sitemap.xml` both return 404.
- Twenty substantive public routes share one default title and description.
- No public route exposes a canonical URL, Open Graph metadata, Twitter metadata, or structured
  data.
- An unknown project issues a temporary 307 redirect to an indexable 200 error page instead of a
  404.
- The repository says the production URL is `https://mikechaves.io`, while the live edge
  permanently redirects that host to `https://www.mikechaves.io`.
- Vercel Web Analytics is integrated in React but is not enabled for the Vercel project; its API
  returns `Web Analytics not found`.
- GA4 and Vercel Speed Insights are not implemented.

## Product context from repository evidence

| Question | Evidence-backed answer |
| --- | --- |
| Product name | Mike Chaves portfolio; the visible identity is `MIKE_CHAVES` and the default title is `Mike Chaves \| AI-Native Design Engineer`. |
| Canonical production origin | `https://www.mikechaves.io`. It is the only custom origin that returns 200; the apex permanently redirects to it. |
| Alternate or legacy origins | `http://mikechaves.io`, `http://www.mikechaves.io`, `https://mikechaves.io`, `v0-cyberpunk-portfolio-chi.vercel.app`, `portfolio-mikechaves-projects.vercel.app`, and `portfolio-git-main-mikechaves-projects.vercel.app`. Branch and immutable deployment URLs are preview/deployment infrastructure, not canonical origins. |
| Intended users | Hiring managers, product/design/engineering leaders, founders, AI and game teams, and collaborators evaluating Mike's work. This is inferred from the role-fit workflow, resume/contact paths, positioning copy, and case-study evidence. |
| Primary user problem | A reviewer needs to determine whether Mike can design and build a specific AI-native or interactive product system without relying on ungrounded portfolio claims. |
| Primary product action | Start and complete an Adaptive Focus Role Fit Brief that maps a role or preset lens to reviewed evidence. |
| Primary business conversion | Submit the contact form successfully (`generate_lead` in GA4 terminology). |
| Secondary conversions | Open project evidence, download the resume, select a contact or role-fit CTA, open a relevant live demo/repository, and share a case study. |
| Public content types | Portfolio overview, operating profile/about, project hub, eleven project evidence dossiers, writing hub, five article summaries linking to original Medium articles, and a lower-prominence archive. |
| Authentication boundary | No application authentication exists. Vercel Authentication protects production deployment URLs and all preview deployments; custom production domains remain public. |
| Data model | Curated project order and summaries are loaded from `public/data/projects.json` through `data/projects.ts`; article summaries live in `lib/posts.ts`; confidential/employer-approved experience is deliberately separated from public project records. |
| Rendering strategy | Next.js App Router. Home, About, and Projects are Client Components but are still server-prerendered into meaningful initial HTML. Project details are dynamically server-rendered from a local JSON file. Blog detail and archive routes are static. |
| Primary deployment | Vercel project `portfolio`; production deployment `dpl_GCQQcK6iUr6w8LYqfwuVGKuWAGWT` is Ready at exact Git SHA `55c469779d2ccb2f4cad3b305a078c4203712955`. |

## Canonical-origin evidence

Observed on 2026-08-09:

| Request | Result |
| --- | --- |
| `http://mikechaves.io/` | 308 to `https://mikechaves.io/` |
| `https://mikechaves.io/` | 308 to `https://www.mikechaves.io/` |
| `http://www.mikechaves.io/` | 308 to `https://www.mikechaves.io/` |
| `https://www.mikechaves.io/` | 200, statically prerendered, Vercel cache hit |

The HTTP apex currently takes two hops. Repository configuration will use the serving `www` host
for all canonical URLs and will guard known legacy Vercel aliases. The Vercel domain-level apex
redirect remains the authoritative production redirect unless the owner deliberately reverses the
domain preference later.

## Route and metadata crawl baseline

The live crawl covered the homepage, About, Projects, all eleven current project IDs, Blog, all
five article summaries, Archive, Error, an unknown project, `robots.txt`, and `sitemap.xml`.

| Finding | Baseline |
| --- | --- |
| Substantive public routes checked | 20 |
| Successful substantive routes | 20/20 |
| Routes with one visible H1 | 20/20 |
| Routes with meaningful initial HTML | 20/20 |
| Routes with unique titles | 1/20 (Archive only; the remaining 19 use the global default) |
| Routes with unique descriptions | 1/20 (Archive only; the remaining 19 use the global default) |
| Routes with a canonical URL | 0/20 |
| Routes with Open Graph metadata | 0/20 |
| Routes with Twitter metadata | 0/20 |
| Routes with structured data | 0/20 |
| `robots.txt` | 404 |
| `sitemap.xml` | 404 |
| Unknown project behavior | 307 to `/error?message=Project%20not%20found`, then an indexable 200 page |

The initial HTML is not an empty hydration shell. Sample body-text character counts ranged from
approximately 15,900 on the homepage to 29,200 on a project dossier. This supports retaining the
existing rendering architecture while moving metadata and route control into official App Router
APIs.

## Crawl and indexability baseline

- The site has no explicit robots policy or curated sitemap.
- Search parameters used by Metaverse, Adaptive Focus, and focus-context handoffs do not currently
  resolve to a declared canonical URL.
- Stable retired project IDs correctly issue server-side 308 redirects to the approved public
  professional-experience section.
- Vercel SSO protection is enabled for `prod_deployment_urls_and_all_previews`, which prevents the
  protected preview surfaces from acting as public duplicates.
- Stable Vercel project aliases are still listed as project domains. They need an application-level
  redirect or a noindex response when they reach the application.
- The archive is public and linked, but its legacy/synthetic-data content is intentionally lower
  prominence and should be `noindex, follow` rather than included in acquisition search results.

## Measurement baseline

- `@vercel/analytics` is installed and `<Analytics />` is rendered globally.
- Six bounded, privacy-reviewed custom Vercel events exist. Their property allowlist excludes raw
  role text, contact-form contents, names, email, company, and message data.
- The Vercel Web Analytics account endpoint returns 404 `Web Analytics not found`, so no current
  visit, referrer, route, or custom-event baseline can be retrieved from that project.
- GA4 is absent. There is no measurement-ID environment variable, consent control, manual
  page-view implementation, or DebugView-compatible development path.
- Vercel Speed Insights is absent.
- A public web-search sample for `site:mikechaves.io Mike Chaves` did not surface a result for this
  portfolio. This is a qualitative observation, not proof of Google index state; Search Console is
  required for authoritative coverage and query data.

## Page-experience baseline

- The production build succeeds and statically renders 15 route entries; project details are
  server-rendered on demand.
- First-load JavaScript is approximately 159 kB for Home and Projects, 179 kB for About, and 184 kB
  for project dossiers according to the Next.js build report.
- The homepage WebGL background is client-only and is not the sole source of page meaning.
- Font loading uses `next/font` with `display: swap`.
- Existing visual smoke coverage exercises desktop and mobile routes, runtime errors, horizontal
  overflow, category interactions, evidence privacy boundaries, and retired redirects.
- Field Core Web Vitals are unavailable because Speed Insights is not implemented and no Search
  Console evidence is available. Lighthouse lab evidence will be captured after repository fixes;
  lab tools cannot measure real-user INP.

## Pre-change validation

Run with Node 22.22.0, matching the configured Vercel runtime major:

| Command | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed; synchronized the existing Playwright dependency into local `node_modules`. |
| `pnpm lint` | Passed with no warnings or errors. |
| `pnpm test:unit --runInBand` | 26 suites and 169 tests passed. |
| `pnpm check:links` | Passed: 183 assets, 57 internal routes, 53 external/mailto references, and all five required contact/social/resume links. |
| `pnpm build` | Passed; 15 route entries generated. Build configuration currently skips type and lint validation, so those checks remain separate gates. |
| `pnpm type-check` | Passed after the frozen dependency install. |

## Assumptions and evidence limits

- There is no direct search-volume export. Query clusters in `SEARCH_DEMAND_MAP.md` are hypotheses
  based on product language, public search-result vocabulary, and existing evidence; they are not
  volume forecasts.
- No traffic-growth percentage is claimed without Search Console and GA4 baselines.
- Search Console ownership, GA4 property creation, and Vercel dashboard toggles cannot be inferred
  from source code. They remain explicit account-side checks.
- Existing project claims are treated as the approved source of truth. SEO work will not add
  ratings, customers, performance metrics, awards, testimonials, or partnership claims.
