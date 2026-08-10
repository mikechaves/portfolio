# Page Experience Audit

_Repository audit completed: 2026-08-09_

## Result

All five representative route templates pass the repository lab budgets on Lighthouse 12.8.2 in
both its standard mobile profile and desktop preset:

- Largest Contentful Paint (LCP): at most 2,500 ms
- Cumulative Layout Shift (CLS): at most 0.1
- Total Blocking Time (TBT): at most 200 ms

TBT is the repeatable lab responsiveness proxy in this audit. Interaction to Next Paint (INP) is a
field metric; the repository cannot prove an INP result. The production target remains INP at or
below 200 ms and must be evaluated through Search Console Core Web Vitals or another approved field
source after deployment and real traffic.

## Method

The before and after captures used a production `next build`/`next start`, Lighthouse 12.8.2,
Playwright's installed Chromium, and the same five template representatives. Mobile uses
Lighthouse's standard simulated mobile profile; desktop uses `--preset=desktop`. Each value is a
single controlled lab run, so the tables are regression evidence rather than field-CWV claims.

The checked command rebuilds the application, starts a dedicated server, rejects an occupied test
port, captures all ten JSON reports, writes `test-results/performance/summary.json`, and exits
nonzero if any budget fails:

```bash
pnpm exec playwright install chromium
pnpm performance:audit
```

The reports are intentionally untracked test artifacts. CI runs the same command and uploads the
JSON reports and summary as the `portfolio-performance` artifact for 14 days.

## Mobile results

| Template | Route | Performance | LCP before → after | CLS before → after | TBT before → after | Transfer before → after |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Home | `/` | 54 → 98 | 13,435 → 2,483 ms | 0 → 0 | 921 → 15 ms | 2,333 → 238 kB |
| Operator/contact | `/about` | 90 → 98 | 3,606 → 2,312 ms | 0 → 0 | 16 → 8 ms | 432 → 271 kB |
| Project hub | `/projects` | 94 → 98 | 3,135 → 2,383 ms | 0 → 0 | 3 → 3 ms | 415 → 227 kB |
| Project dossier | `/projects/x-games` | 93 → 98 | 3,204 → 2,309 ms | 0 → 0 | 5 → 3 ms | 450 → 290 kB |
| Article summary | `/blog/voice-first-xr` | 92 → 99 | 3,307 → 2,087 ms | 0 → 0 | 0 → 4 ms | 358 → 204 kB |

The homepage mobile transfer fell about 90%, and its LCP fell about 82%. The final mobile range is
2,087–2,483 ms LCP, 0 CLS, and 3–15 ms TBT.

## Desktop results

| Template | Route | Performance | LCP before → after | CLS before → after | TBT before → after | Transfer before → after |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Home | `/` | 88 → 100 | 2,367 → 644 ms | 0 → 0 | 0 → 0 ms | 2,369 → 552 kB |
| Operator/contact | `/about` | 100 → 100 | 688 → 538 ms | 0 → 0 | 0 → 0 ms | 520 → 383 kB |
| Project hub | `/projects` | 100 → 100 | 652 → 518 ms | 0 → 0 | 0 → 0 ms | 588 → 390 kB |
| Project dossier | `/projects/x-games` | 100 → 100 | 676 → 587 ms | 0 → 0.002 | 0 → 0 ms | 504 → 309 kB |
| Article summary | `/blog/voice-first-xr` | 100 → 100 | 647 → 479 ms | 0 → 0 | 0 → 0 ms | 411 → 206 kB |

The final desktop range is 479–644 ms LCP, 0–0.002 CLS, and 0 ms TBT.

## Implemented corrections

1. Replaced the 1.7 MB homepage PNG signal grid with an 82 kB WebP for desktop and a
   transfer-free CSS treatment on mobile.
2. Kept the homepage meaning and visual hierarchy in server-rendered HTML while deferring the
   decorative WebGL layer until desktop idle time. Mobile and reduced-motion users do not download
   that Three.js path.
3. Removed hosted font requests in favor of explicit system font stacks and replaced two X social
   glyphs with a tiny local SVG, removing the Font Awesome runtime and render-blocking stylesheet.
4. Replaced the JavaScript-heavy route entrance with a small CSS transition that runs only after a
   client-side pathname change and disables itself for reduced motion.
5. Split About, Projects, project dossier exits, Adaptive Focus execution, Role Fit details, and the
   media lightbox at their actual interaction boundaries instead of hydrating them all up front.
6. Added a compact public project index so the archive client does not receive the full evidence
   dossier dataset. A test keeps the compact index synchronized with the canonical project records.
7. Disabled automatic Next.js prefetch on persistent/above-fold navigation where it was pulling
   unrelated route chunks into the initial trace.
8. Deferred below-the-fold and supporting media, while keeping explicit dimensions and accessible
   labels to preserve layout stability.

The resulting Next.js first-load JavaScript report is 129 kB for Home, 121 kB for About, 140 kB for
Projects, 131 kB for a project dossier, and 111 kB for an article summary. The pre-change report was
approximately 159 kB for Home/Projects, 179 kB for About, and 184 kB for project dossiers.

## Field verification after deployment

After the exact repository commit is deployed, evaluate route groups through Search Console Core
Web Vitals or another approved field source for at least 28 days or until there are enough real-user
samples. Record p75 LCP, INP, and CLS by mobile/desktop template. Do not describe a lab pass or a
Lighthouse score as
a field-CWV pass.

If field data misses a target, preserve this lab baseline and investigate the affected route,
device, geography, and interaction before changing global design behavior.
