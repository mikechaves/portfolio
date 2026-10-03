# Cinematic portfolio review — October 3, 2026

Local production preview: http://127.0.0.1:3210/.

Isolated branch `mike/cinematic-portfolio`, based on PR #190 merge `443ec6854c4e4abb83a4b861df98bb576af44b55`. The original `main` checkout remains clean at that commit. This delivery is a local review candidate; it has not been merged or deployed.

## Chaves key identity follow-up

The user-directed C key now has the small V between its original teeth, redrawn as a continuous native SVG silhouette. The transparent master, monochrome version and 1024px PNG are in `public/identity/`; browser, Apple and app icons are in `public/favicon/`. All page shells use the new icon links with a cache revision. Exact concept prompts and asset guidance are in `identity/README.md`, with the inspected final proof sheet at `identity/chaves-key-preview.png`.

The production build, TypeScript, targeted ESLint and all four SEO audits passed after this change. Chromium verified the icon links, meaningful content and page identity on home, About, project collection, Wizzo, writing collection and a representative article, with no application console or page errors. Every PNG export served successfully at its intended dimensions; the ICO contains valid 16, 32 and 48px images. The manifest uses Mike Chaves and the midnight palette. The local in-app preview was reloaded and its icon links verified. The proof sheet's tab contexts are illustrations; they are not screenshots of browser chrome.

This was an icon and metadata follow-up. The carousel, interaction and performance results below belong to their respective earlier checks and were not rerun for this asset change. No production release was performed.

## Premiere carousel follow-up — current review candidate

The user requested a true carousel and movie-premiere-style imagery. The stage now opens on Wizzo and rotates through SpeakEasy and Playfold, giving each cover the same large center position. Three new conceptual cover illustrations, generated with the built-in image tool from actual project references, replace the opening thumbnails only. Original case-study evidence remains. Exact prompts, sources and saved master paths are in `PREMIERE-ART.md`.

The flow under test is: homepage → automatic rotation, arrows, keyboard or touch swipe → a different cover fills the center while its case-study link remains usable. Manual navigation pauses rotation; Play resumes. Offscreen and hidden-document behavior, responsive scene recreation, reduced motion, failed imagery and WebGL loss retain usable navigation.

Environment: local production build at `http://127.0.0.1:3210/`; Chromium at 1440 × 1000, 820 × 1180 and 390 × 844, plus the Codex in-app browser. Browser plugin not available; the existing repository Playwright workflow performed automated QA, and CUA was used for visible in-app review. This remains a local review, without production or cross-engine verification.

| Current check | Result |
| --- | --- |
| Build, TypeScript, ESLint | Pass; Node 24 and existing dependencies |
| Unit regression suite | 223 tests / 38 suites passed |
| Full desktop/mobile browser suite | 102 passed; two explicit device-specific skips (desktop touch test, mobile WebGL test) |
| SEO | Four audits passed after the cover/preload change |
| Page identity and meaningful content | Pass: correct title, main content, direct project links and controls |
| Framework overlays / console health | No overlays or application errors observed; recorded capture reported zero console errors |
| Interaction proof | All three covers centered and wrapped, arrows/Home/End/Left/Right, focus-following keyboard link activation, automatic interval, offscreen pause, manual pause/resume, real mobile touch swipe without accidental navigation |
| Reduced motion / failures | Manual navigation without meaningful transition or WebGL; blocked cover imagery, unavailable WebGL and context loss preserve navigation |
| Links / résumé | Existing link audit passed; all 12 new WebP variants separately served HTTP 200; local and served résumé checksum unchanged |
| Visual evidence | Desktop Wizzo/Playfold/SpeakEasy, mobile, reduced-motion composition and 16.16-second actual browser recording inspected |
| Homepage performance | Six cold Lighthouse 12.8.2 samples, same settings and unchanged budgets; both profile medians pass |

An intermediate browser inspection exposed black WebGL cover planes when reusing responsive DOM images as textures. The final scene uses independently loaded, cached texture sources and refreshes them when the displayed image variant changes. This was rechecked in the actual browser and recording. An initial reduced-motion test expected exactly zero duration; the existing global accessibility rule uses 0.000001 seconds. The final assertion accepts only durations below one millisecond and separately verifies manual navigation and no WebGL requests.

| Current homepage profile | Score | Median LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: |
| Mobile, simulated throttling | 98 | 2,329 ms | 0 | 0 ms |
| Desktop preset | 100 | 691 ms | 0 | 0 ms |

Budgets remain LCP ≤ 2,500 ms, CLS ≤ 0.1, TBT ≤ 200 ms. All six samples and the summary are in `evidence/performance-premiere/`. Other-route measurements below belong to the preceding complete-site audit and were not rerun for this opening-only follow-up. Field performance remains unmeasured.

Evidence: `evidence/premiere-wizzo-desktop.png`, `premiere-speakeasy-desktop.png`, `premiere-playfold-desktop.png`, `premiere-mobile.png`, `premiere-mobile-speakeasy.png`, `premiere-reduced-motion.png`, and `premiere-carousel.mp4` / `.webm`. The recording shows an actual automatic transition followed by manual rotation and pointer response. Reproduce it with `node docs/cinematic/capture-premiere.mjs` while the production preview runs on port 3210.

The opening keeps the selected reference's dark hall, large serif identity, three dimensional planes, and warm reflections. The deliberate deviations are equal center-stage treatment for all projects, new premiere cover art and live title overlays, and a mobile carousel with adjacent-cover peeks. The approved résumé and original main checkout remain unchanged.

## Original complete-site rebuild checks

The remaining sections preserve the full audit before the carousel and cover-art follow-up above.

| Check | Result |
| --- | --- |
| Next production build | Passed, Node 24, existing pnpm lockfile |
| TypeScript | Passed |
| ESLint | Passed; existing legacy-configuration deprecation warning |
| Jest | 223 tests, 38 suites passed |
| Production Chromium desktop/mobile | 97 passed; one intentional skip for the desktop-only WebGL scene |
| SEO | Four audits passed, including initial HTML and rendered routes, metadata, canonical/robots and redirect policies |
| Analytics debug audit | Five passed; consent, decline/reopen, GPC/DNT, bounded paths and focus/project/writing/share events; zero provider transport |
| Local links/assets | 304 assets, 185 route references, all five required contact/social/résumé links; external URLs syntax-checked |
| Lighthouse performance | All ten route/profile medians passed the unchanged budgets; 30 cold samples |
| Resume | Local and served SHA-256 match the approved file; legacy PDF URL returns 308 |

The final image pass reuses responsive WebP files across the opening, featured work, collection and case covers. Precompressed case-study media use native image elements, preserving dimensions, captions and fullscreen controls while avoiding an unnecessary client image runtime. Full-size originals remain available. Build, type check, lint, all unit tests, the full 98-case browser suite and SEO were rerun after the final font preload, stylesheet split and server-side media metadata changes. Analytics was verified earlier in this rebuild; its consent and event contracts were unchanged by these delivery optimizations.

## Interaction and failure coverage

- All eight Adaptive Focus presets, truthful evidence names, selection, project ordering and reset. Keyboard activation, touch/mobile behavior, More lenses, custom role handoff, storage clearing and local fallback after a mocked 503.
- Full project collection filters, role evidence removal/edit/reset and existing case-study resources, image viewers, focus return, downloads and retired confidential-project redirects.
- Desktop 1440 × 1000, tablet 820 × 1180 and mobile 390 × 844. No horizontal overflow in route checks. Native modal mobile navigation supports Escape and focus behavior.
- Reduced motion and mobile retain real HTML artwork without loading the optional scene. Failed artwork exposes project titles. WebGL unavailability and context loss preserve project links and restore HTML art. Scene pause/resume, navigation cleanup, offscreen lifecycle and desktop → mobile → desktop recreation checked. Intentional disposal no longer triggers the context-loss failure state.
- The existing contact request behavior is tested with mocked submission; no email was sent. The existing model-backed custom role route was contract-tested and its local failure fallback was browser-tested; no paid live-provider request was made.

## Visual comparison

Reviewed the generated `concepts/night-frequency.jpg`, the user’s matching reference, final browser screenshots, mobile layout and recording frames using image inspection. The user’s later direction intentionally removes promotional copy from the initial concept.

| Reference characteristic | Final implementation and review |
| --- | --- |
| Large centered editorial identity | Mike Chaves is the dominant serif title; the sales paragraph was removed at the user’s request. |
| Dark architectural world | Indigo-black hall, restrained amber practical light, reflective floor, no terminal grid or separate virtual-room navigation. |
| Three substantial project planes | Real Wizzo identity leads in the center, with actual Playfold and SpeakEasy artwork alongside. Links and captions remain HTML. |
| Depth and motion | Metal frames, perspective, reflected artwork and damped camera changes; pause control remains available. Final frames align with their link hit areas. |
| Compact Adaptive Focus below the opening | Four primary controls plus four additional lenses, warm selected states and a short evidence preview. Custom role entry stays optional. |
| Mobile art direction | One large Wizzo image with Playfold/SpeakEasy paired beneath. No WebGL dependency or wide scene squeezed into a phone. |
| Personal creative platform | Writing and public appearances lead into honest acting/music placeholders, with About, contact and résumé directly reachable. |
| Factual identity and imagery | Actual project materials and event imagery; supplied portrait on About. No invented releases, acting credits, clients, outcomes or testimonials. |

This is an interpretation of the chosen visual study, not a pixel-exact copy. The study’s incorrect project taglines and sales sentence were intentionally replaced or removed.

## Review artifacts

- `evidence/home-desktop.png`: actual WebGL opening, 1440 × 1000.
- `evidence/home-fallback-desktop.png`: corresponding HTML still composition.
- `evidence/home-mobile.png` and `evidence/tablet.png`: responsive opening.
- `evidence/adaptive-focus-desktop.png`: Game UX selected with real evidence names.
- `evidence/selected-work-desktop.png`, `work-desktop.png`, `writing-desktop.png`, `appearances-desktop.png`, `music-desktop.png`, `about-desktop.png`, `playfold-desktop.png`: representative surfaces.
- `evidence/motion.mp4` and `motion.webm`: actual browser recording of pointer response, pause/resume, three lens changes, reset, work, appearances/music and About. The 15-second capture includes deliberate viewing pauses; no generated animation is presented as runtime evidence.
- `capture-evidence.mjs`: reproducible local browser capture script. Route-wide full-page PNGs remain in `test-results/playwright`.

## Preservation

Career/evidence data, project records and source attribution were not edited. Existing project URLs, article routes, SEO metadata and structured data remain. `/metaverse` and the old query entry redirect into the main opening. The supplied portrait and event imagery are not presented as client work. The stage’s architectural plate is original portfolio scenography, described in `DIRECTION.md`.

Approved résumé SHA-256: `5e8ee9b0ed28531e98bddc3f0afaa81c6c6bfbad59b70604e2fc3b2329d81fed`.

## Performance

Measured with the repository’s unchanged Lighthouse 12.8.2 audit: three cold samples per route/profile, median aggregation, mobile simulated throttling and the desktop preset, against a local production build. Budgets remain LCP ≤ 2,500 ms, CLS ≤ 0.1 and TBT ≤ 200 ms. Production INP and real-user network/device behavior require field data after a separately approved deployment.

The first audit exposed font-related layout shifts, deferred collection rendering and excessive image transfer. The display font is self-hosted and preloaded; responsive opening art is preloaded; the collection renders in the initial HTML; appropriately sized image files are reused. Supporting text uses local system fonts. Homepage-only styles are separated from case studies and writing. Case-study breadcrumbs no longer prefetch the complete collection, and media metadata is resolved per project on the server instead of shipping the full catalogue to every case study. The temporary inline-CSS experiment was removed because it increased the HTML payload. Baseline and early intermediate reports are retained in `evidence/performance-history.tar.gz`. Two intermediate audits, including the case-study mobile LCP failures that prompted further work, are retained in `evidence/performance-before-case-image-trim.tar.gz` and `evidence/performance-before-prefetch-trim.tar.gz`, separately from final results. Targeted diagnostic samples are retained in `evidence/performance-diagnostics.tar.gz`.

| Route | Profile | Score | LCP | CLS | TBT | Result |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `/` | mobile | 100 | 1,730 ms | 0 | 0 ms | Pass |
| `/about` | mobile | 100 | 1,504 ms | 0 | 0 ms | Pass |
| `/projects` | mobile | 98 | 2,385 ms | 0 | 2 ms | Pass |
| `/projects/x-games` | mobile | 98 | 2,457 ms | 0 | 0 ms | Pass |
| `/blog/voice-first-xr` | mobile | 99 | 2,000 ms | 0 | 0 ms | Pass |
| `/` | desktop | 100 | 544 ms | 0 | 0 ms | Pass |
| `/about` | desktop | 100 | 328 ms | 0 | 0 ms | Pass |
| `/projects` | desktop | 100 | 584 ms | 0 | 0 ms | Pass |
| `/projects/x-games` | desktop | 100 | 538 ms | 0 | 0 ms | Pass |
| `/blog/voice-first-xr` | desktop | 100 | 455 ms | 0 | 0 ms | Pass |

All ten route/profile medians passed. The unchanged audit collected 30 cold samples; final raw reports are in `evidence/performance/lighthouse-reports.tar.gz`, with metrics in `evidence/performance/summary.json`. Individual samples are retained, including any variation above or below the median.
