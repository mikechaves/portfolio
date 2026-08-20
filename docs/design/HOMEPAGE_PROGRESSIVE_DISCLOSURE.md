# Homepage Progressive Disclosure

_Baseline captured August 20, 2026. Implementation and release evidence will be appended to this
document as the work moves through local, Preview, and Production gates._

## Scope and release identity

- Repository: `mikechaves/portfolio`
- Canonical production origin: `https://www.mikechaves.io`
- Working branch: `portfolio/homepage-progressive-disclosure`
- Starting `origin/main`: `d061434` (`Record production acquisition verification`)
- Required privacy predecessor: PR #183, merged as
  `62db0c1a7a5dfd361cfe41a3a63d8f588779ce2a`; verified as an ancestor of the starting head
- Design thesis: one clear statement, two primary paths, three flagship proofs, optional role
  personalization, and one direct conversion

## Baseline method and evidence

The live production homepage was captured in the Codex in-app browser at the four required Phase 1
viewports. Each saved image was opened and visually inspected before being accepted. The repository
QA convention says not to commit browser QA captures, so immutable local evidence is stored outside
the Git tree in this task's Codex visualization artifact directory, under the
`homepage-progressive-disclosure/baseline/` folder.

Accepted images:

- `home-1440x900.png`
- `home-1280x800.png`
- `home-1024x768.png`
- `home-390x844.png`

The machine-readable viewport measurements are in `viewport-metrics.json`. The fresh Lighthouse
reports and summary are in the adjacent `performance/` directory. These references are local QA
evidence, not public portfolio media and not files to commit.

## Production viewport baseline

| Viewport | Hero height | Adaptive Focus height | Selected work begins | Initial-view controls | Initial-view result |
| --- | ---: | ---: | ---: | ---: | --- |
| 1440 x 900 | 337 px | 241 px | 686 px | 22 | Heading and project imagery are visible, but only after a dense 578 px hero/configuration stack. |
| 1280 x 800 | 394 px | 241 px | 743 px | 22 | The selected-work rail barely enters the viewport. |
| 1024 x 768 | 427 px | 443 px | 978 px | 16 | Selected work is below the fold; the lens deck becomes a dense internal reading surface. |
| 390 x 844 | 544 px | 863 px | 1511 px | 6 | The first preset only begins near the bottom of the viewport; selected work is far below it. |

Across the initial desktop view, all seven preset lenses are presented at once. At 1280 x 800 the
page exposes approximately 634 visible interface-text characters before selected work. Neither a
resume action nor a contact action exists in the initial viewport or homepage content.

## Current journey audit

### Strengths

- The Black Sun scene, condensed name treatment, green signal color, and terminal metadata create a
  distinctive identity immediately.
- Wizzo, Playfold, and SpeakEasy are the first public project proofs and retain the canonical order.
- Adaptive Focus exposes a real evidence-ranking workflow, not a decorative form.
- The standard homepage defers its WebGL layer, and the Metaverse bundle is dynamically imported
  only after the explicit query-state entry.
- The production page has no horizontal page overflow at the captured viewports.

### UX risks

- Identity, positioning, system telemetry, hero actions, role input, seven lenses, a separate action
  column, and a duplicate proof action all compete before the visitor reaches public proof.
- `Inspect Proof`, `Read Positioning`, `Impact`, and `Systems` require interpretation instead of
  naming visitor tasks.
- `Enter Metaverse` occupies the visual center of the desktop header even though immersive mode is
  optional for the hiring journey.
- Featured cards mix outcome copy with up to six technologies, making the fastest trust signal read
  like another evidence console.
- Systems, Leadership Brief, and Latest Signals form three equal-weight panels instead of a clear
  continuation from projects to experience, capability, public practice, and contact.

### Accessibility risks

- The desktop tab order reaches 16 navigation, hero, and Adaptive Focus choices before the duplicate
  `Inspect Proof` link, and 18 before the first project card.
- There is no skip-to-content link.
- The current mobile menu closes on route changes but does not implement Escape, focus containment,
  or focus return to the trigger.
- Reduced-motion emulation prevents the WebGL canvas and disables route/card transitions, but the
  header's `online` indicator continues to run its pulse animation.
- Much of the interface guidance and card copy is 10-12 px monospace text, which is visually
  difficult even when its token colors pass the repository's coarse contrast test.

Screenshot evidence supports hierarchy and visible reflow findings only. Semantic structure,
keyboard behavior, motion, and provider/network behavior were checked separately; no screenshot is
presented as proof of full WCAG conformance.

## Keyboard baseline

The desktop production tab sequence was exercised in a reduced-motion Chromium context after the
in-app browser could not advance synthetic Tab presses reliably. The sequence begins:

1. `MIKE_CHAVES` identity
2. `Enter Metaverse`
3. `impact`
4. `systems`
5. `writing`
6. `about`
7. `Inspect Proof`
8. `Read Positioning`
9. Role textarea
10. Seven preset buttons
11. Duplicate `Inspect Proof`
12. `View all projects`
13. Wizzo, Playfold, and SpeakEasy

The disabled custom-submit button is correctly omitted while the input is empty. The observed order
is DOM-logical, but the number of choices before evidence and the lack of a skip link make the
default path unnecessarily long.

## Analytics baseline

The current abstraction allowlists Adaptive Focus start/completion/failure, project opens, article
original opens, portfolio conversion clicks, project shares, and contact success/failure. Raw role
text, job descriptions, query strings, contact content, and private evidence IDs are prohibited and
are absent from the allowlist.

The redesign must preserve that boundary while adding bounded source labels for:

- hero selected-work and role-match actions;
- homepage resume and contact actions;
- More-lenses expansion;
- writing/public-practice item opens;
- optional Metaverse entry.

No event may include the role input, normalized query, model output, email address, or message text.

## Performance baseline

A fresh `pnpm performance:audit` run used Node 20.19.5, Next.js 15.2.8, Lighthouse 12.8.2, and the
repository's existing five-route/two-profile budgets. All ten scenarios passed.

| Homepage profile | Score | LCP | CLS | TBT | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile | 98 | 2466 ms | 0 | 5 ms | 237 kB |
| Desktop | 100 | 685 ms | 0 | 0 ms | 552 kB |

The complete baseline is stored in the external evidence directory. These are controlled lab
measurements, not field Core Web Vitals. Production field evidence remains a separate Search
Console or approved-RUM gate.

## Design and implementation guardrails

- Keep the Black Sun/cosmic environment, green signal accent, strong display type, motion language,
  Adaptive Focus, and optional Metaverse.
- Preserve the eleven-project public order and the homepage order Wizzo, Playfold, SpeakEasy.
- Preserve `/projects/x-games` and other technical identifiers while using Playfold publicly.
- Professional experience remains image-free, non-linked evidence: Astrocade confidential
  production AI operations, Snorkel approved public contribution, Ford production manufacturing,
  and Starbucks exploratory prototypes.
- Do not modify matching/ranking behavior unless a verified bug requires it.
- Do not store or measure role text.
- Do not make repository readiness, Preview readiness, merge authorization, and Production proof
  interchangeable.

## Target journey

The implementation will replace the current console-first sequence with:

1. Task-oriented global navigation
2. A concise role/value hero with selected-work, role-match, and resume actions
3. A compact Adaptive Focus launcher with four default presets and progressive disclosure
4. Three concise flagship project proofs
5. Four compact professional-experience records
6. Four capability families
7. One writing/public-practice section with no more than three items
8. A direct contact, resume, and LinkedIn conversion

Implementation, Preview, and Production results will be appended only when each corresponding gate
has been verified.

## Selected visual direction

The implementation target was established before code changes with four generated design
references, each grounded in the captured production Black Sun scene and the existing public
project media. The source prompts deliberately retained the current identity while removing the
console-density that obscures the hiring journey. The accepted references are stored outside the
Git tree beside the baseline evidence under `concepts/`:

- `desktop-first-viewport-v2.png`: task navigation, concise value hero, two primary paths, resume,
  compact role lens, and an early selected-work handoff
- `desktop-core-content-v2.png`: three flagship proofs, image-free professional evidence, and four
  capability families
- `desktop-lower-content-v1.png`: one featured article, two public-practice signals, and the final
  conversion band
- `mobile-first-viewport-v1.png`: a single mobile menu trigger, 44 px actions, wrapped role lenses,
  and the beginning of selected work in the first 390 x 844 composition

These are direction and fidelity references, not website assets. No generated concept image will be
served by the product or committed as public portfolio media.

### Design system extraction

| Element | Implementation decision |
| --- | --- |
| Foundation | True black `#000000`, existing Black Sun image and progressive fallback, no gradient overlays added by the redesign |
| Signal accent | Existing primary green, used for primary actions, active/focus states, and thin section rules rather than status decoration |
| Text | Off-white primary text, zinc secondary text, and zinc metadata with the existing contrast-safe tokens |
| Type | Existing condensed display face for identity and major headings; a new system sans stack for explanatory copy; existing monospace for labels, navigation, status, and controls |
| Geometry | Square or near-square corners, one-pixel borders, restrained panels, and no generic rounded-card grid |
| Spacing | One shared page shell, `clamp()`-based section rhythm, compact hero/launcher stack, and visibly larger gaps between major evidence groups |
| Motion | Existing progressive atmosphere only; short color/border transitions; all non-essential animation disabled under `prefers-reduced-motion` |
| Responsive behavior | Three featured columns and four capability columns on wide screens; stacked records and wrapped controls without horizontal page overflow on narrow screens |

### Component families

The redesign uses a small, consistent family of surfaces: task navigation and utility actions; hero
primary, secondary, and text actions; one Adaptive Focus panel with preset chips and a native
progressive disclosure; a concise featured-project variant; non-linked professional evidence rows;
capability families; editorial writing/public-practice rows; and one final conversion band. Public
project routes, evidence records, and the Adaptive Focus runtime remain the source of truth rather
than being duplicated into decorative UI data.

## Local implementation result

The implemented homepage now follows the required hiring journey in source and visual order:

1. task-oriented navigation with Work, Experience, Writing, About, Resume, Contact, and a secondary
   Metaverse utility;
2. a Black Sun hero with the AI-Native Design Engineer role, direct value proposition, retained Mike
   Chaves name treatment, selected-work path, role-match path, and canonical resume action;
3. a compact Adaptive Focus launcher with one role input, four default presets, three disclosed
   presets, and explicit model/privacy copy;
4. Wizzo, Playfold, and SpeakEasy featured cards using the stable public routes and concise proof;
5. image-free, non-linked Astrocade, Snorkel AI, Ford, and Starbucks records with their disclosure
   and production/prototype distinctions intact;
6. four capability families, one article plus two public-practice signals, and a protected contact,
   resume, and LinkedIn conversion.

The mobile task menu is a focus-managed dialog: Escape closes it, focus is contained while open,
and focus returns to its trigger. The main content has a skip link, stable section anchors, one `h1`,
ordered `h2` sections, visible focus states, and no new immersive or Three.js dependency in the
standard homepage path.

The priority Black Sun backdrop remains a dedicated 1200 x 475, 17 kB static WebP. A high-priority
preload feeds a lightweight presentational canvas that paints the approved source composition
without entering the deployment provider's image-optimization path or displacing the semantic hero
heading as the LCP candidate. The canvas image decode remains asynchronous, and the noncritical
WebGL atmosphere waits for a six-second defer plus an idle window instead of entering the critical
performance trace.

Homepage featured-card media now loads only when its card enters the viewport; public project
titles, proof copy, routes, and analytics links remain server-rendered. The `/projects` response
likewise carries its H1, proof ledger, and all eleven canonical project links in static HTML, while
the heavier role/filter explorer loads near the viewport or after a bounded fallback. Adaptive
Focus query handoffs bypass that defer and initialize immediately. Mobile still begins with three
canonical cards, desktop with six, and `See More` reveals all eleven in the required order.

### First-viewport result

| Viewport | Hero height | Adaptive Focus height | Selected work begins | Featured cards begin | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| 1440 x 900 | 327 px | 250 px | 665 px | 791 px | Heading and 109 px of real project imagery are visible without scrolling. |
| 1280 x 800 | 307 px | 246 px | 641 px | 759 px | Selected work begins 102 px earlier than baseline and the project row enters the viewport. |
| 1024 x 768 | 288 px | 239 px | 615 px | 719 px | Selected work begins 363 px earlier than baseline and project imagery is visible. |
| 390 x 844 | 416 px | 310 px | 810 px | 966 px | The stack is 701 px shorter than baseline; the selected-work label begins in the initial viewport. |

At 768 x 1024 and 320 x 568, the production build also has no horizontal overflow. Every visible
mobile link, button, summary, input, and textarea measures at least 44 x 44 CSS pixels. The desktop
navigation remains intentionally compact while retaining visible keyboard focus.

Final local captures are stored outside the Git tree under
`homepage-progressive-disclosure/after/`, including all six required QA widths, a full-page capture,
and a same-viewport concept-versus-implementation comparison. They contain public portfolio content
only and are not served by the site.

## Privacy, analytics, and crawl contracts

- Hero paths, homepage resume/contact conversion, featured-project opens, writing/public-practice
  opens, More-lenses expansion, Adaptive Focus starts/completions, and Metaverse entry use the
  existing bounded analytics abstraction.
- Raw role text, query strings, provider output, contact content, email addresses, and private
  evidence IDs are excluded from event properties and verified absent in the debug audit.
- Presets remain local; custom analysis is explicitly described as processed by OpenAI and not
  stored, with a visible warning not to submit confidential information.
- Consent decline, Global Privacy Control, and Do Not Track produce zero optional provider
  transport. No analytics vendor was added.
- Canonical URLs, sitemap behavior, structured data, public project routes, confidential redirects,
  archived-project controls, and GeoVoice visibility remain covered by the SEO audit.

## Local release gate

All required local commands pass on Node 20.19.5 and pnpm 10.15.1:

- frozen-lockfile install: pass;
- lint: pass (the repository's legacy ESLint config emits its ESLint 10 migration notice only);
- type-check: pass;
- unit tests: 35 suites, 206 tests passed;
- link/asset audit: 197 assets, 177 internal routes, 82 external or mail references, and all five
  required contact/social/resume links passed;
- production build: pass, homepage first-load JavaScript 122 kB and project-index first-load
  JavaScript 107 kB;
- visual/browser smoke: 40 tests passed across desktop and mobile;
- SEO audit: 4 tests passed;
- analytics audit: 5 tests passed with zero-provider privacy scenarios;
- performance audit: all 10 route/profile scenarios passed.

### Homepage performance comparison

| Profile | Baseline | Implementation | Change |
| --- | --- | --- | --- |
| Mobile | score 98; LCP 2466 ms; CLS 0; TBT 5 ms; 237 kB | score 98; LCP 2314 ms; CLS 0; TBT 6 ms; 232 kB | LCP 152 ms faster; CLS preserved; transfer 5 kB lower; TBT remains well inside budget. |
| Desktop | score 100; LCP 685 ms; CLS 0; TBT 0 ms; 552 kB | score 100; LCP 498 ms; CLS 0; TBT 0 ms; 288 kB | LCP 187 ms faster and transfer 264 kB lower. |

These are controlled Lighthouse lab results. They are not field Core Web Vitals or proof of Search
Console ingestion. Preview readiness, exact-head merge, deployment readiness, and canonical
Production verification remain separate release gates.
