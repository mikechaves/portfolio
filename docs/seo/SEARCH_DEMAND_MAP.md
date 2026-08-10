# Search Demand Map

_Initial hypothesis date: 2026-08-09_

## Evidence policy

No Google Search Console export, GA4 history, or paid keyword-volume dataset was available at this
checkpoint. The clusters below are demand hypotheses, not forecasts. They combine:

- exact language already supported by the public portfolio and project evidence;
- visible vocabulary used on current public search results for AI-native product/design roles and
  AI game-creation products;
- the questions a hiring or product leader would need the portfolio to answer;
- the conversion paths that already exist in the product.

A public search sample did not surface this portfolio for `site:mikechaves.io Mike Chaves`. That
observation is not an index-coverage verdict. Search Console must establish actual indexed URLs,
queries, impressions, clicks, and positions after deployment.

## Audience and conversion model

| Layer | Definition |
| --- | --- |
| Primary audience | Hiring managers, founders, and product/design/engineering leaders seeking an AI-native design engineer or design-oriented product engineer. |
| Secondary audience | AI/game creator-platform teams, workflow-tool teams, XR/accessibility teams, research peers, and collaborators seeking relevant evidence. |
| User problem | Determine whether Mike has relevant, reviewable evidence for a specific role or product problem without exposing confidential work or relying on unsupported claims. |
| Primary product action | Start and complete an Adaptive Focus Role Fit Brief. |
| Primary business conversion | Submit a qualified contact inquiry. |
| Secondary conversions | Inspect project evidence, download the resume, open a live artifact/repository, or share a relevant case study. |

## Topic and landing-page map

| Priority | Audience and problem | Search intent | Query/topic cluster | Landing page | Supporting capability/evidence | Primary conversion | Internal links in/out | Evidence level | Measurement plan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Product, design, or engineering leader needs a hybrid practitioner who can move from workflow framing into implementation. | Evaluate a candidate/service provider. | `AI-native design engineer`, `AI product design engineer`, `design engineer AI products`, `AI-native product builder` | `/` and `/about` | Visible positioning, operating loop, reviewed projects, professional-evidence boundary. | Start Adaptive Focus; then submit contact. | Home → Projects/About; About → selected dossiers, resume, contact; dossiers → About/contact. | Direct repository evidence; query demand is qualitative. | `page_view`, `adaptive_focus_started`, `adaptive_focus_completed`, `generate_lead`; Search Console impressions/clicks by page and nonbranded query. |
| P0 | AI product leader needs human review, evaluation, and operational guardrails rather than a generic chatbot UI. | Find expertise and examples. | `human-in-the-loop AI product design`, `AI evaluation workflow UX`, `AI operations design`, `human review AI interface` | `/about`, `/projects/wizzo`, `/projects/petition-ready`, `/projects/vulnerability-visualizer` | Human-in-the-loop workflow framing, evidence/review boundaries, operational dashboards. | Inspect a relevant dossier, complete Role Fit, submit contact. | About operating loop ↔ project hub/dossiers; related dossier modules connect adjacent work. | Direct public evidence; no volume data. | Entry-page views, project opens, Role Fit completion, contact conversion; query/page pairs in Search Console. |
| P0 | Game/creator-platform team needs proof across game UX, AI generation, discovery, and creator tooling. | Evaluate relevant portfolio work. | `AI game platform design`, `game UX design engineer`, `AI game creator tools`, `social game platform UX` | `/projects/x-games` and `/projects` | Playfold creation loop, game discovery/ranking evidence, Sound Escape VR, Portals, Die, AI!. | Open Playfold evidence or run the game/creator Role Fit lens; submit contact. | Home featured project → Playfold; Projects game category → four dossiers; Playfold related work → adjacent game systems. | Direct repository evidence; public search shows active AI game-creation category, not volume. | Landing page view, `project_evidence_opened`, share, relevant external CTA, Role Fit completion, contact. |
| P1 | XR/accessibility leader needs voice-first and multimodal spatial-interaction evidence. | Research lessons and evaluate experience. | `voice-first XR accessibility`, `accessible spatial computing design`, `voice interaction VR`, `XR accessibility case study` | `/blog/voice-first-xr`, `/projects/speakeasy`, `/projects/portals` | SpeakEasy research-through-design, voice/multimodal feedback, Portals voice routing, original writing. | Read the summary/original article, inspect a dossier, submit contact. | Blog hub → article summary → SpeakEasy/Portals; project pages → related writing/resources. | Direct portfolio/article evidence; no volume data. | Article and dossier views, outbound article selection, project open, share, contact. |
| P1 | Creative-operations or brand-system team needs governed automation with deterministic review. | Find implementation examples. | `AI creative operations workflow`, `creative automation pipeline`, `human review generative assets`, `creative ops design engineer` | `/projects/creative-supply-engine` | Structured briefs, localization, reusable assets, review gallery, disclosed sample-brand status. | Inspect artifact/repository; submit contact. | Projects hub and related dossiers → detail; detail → About/contact and adjacent operational systems. | Direct project evidence; no volume data. | Dossier view, external artifact/repository click, share, contact. |
| P1 | Security/product team needs a way to inspect and communicate a large vulnerability dataset. | Find a relevant dashboard example. | `vulnerability visualization dashboard`, `security review dashboard UX`, `CVE data visualization`, `AI-assisted vulnerability triage` | `/projects/vulnerability-visualizer` | Search/filter/detail workflow, local sample fallback, public dataset scale already disclosed in the case study. | Inspect demo/repository; submit contact. | Project hub/AI category → detail; detail → related operational evidence/About. | Direct project evidence; avoid repeating scale outside approved copy. | Dossier view, demo/repository CTA, share, contact. |
| P1 | 3D/web-tool team needs browser-native material-authoring and comparison evidence. | Find a tool or implementation example. | `web PBR material editor`, `browser material authoring tool`, `Three.js material editor`, `interactive 3D product tool` | `/projects/material-explorer` | Material library, typed controls, live preview, comparison, persistence/export. | Open live beta/repository; submit contact. | Project hub/3D category → detail; detail → adjacent immersive systems/About. | Direct project evidence; no volume data. | Dossier view, live-demo/repository CTA, share, contact. |
| P1 | Legal-operations team needs AI assistance that preserves professional review and readiness gates. | Evaluate a workflow example. | `AI legal intake workflow`, `paralegal case readiness dashboard`, `human review legal AI UX`, `bankruptcy intake software design` | `/projects/petition-ready` | Case blockers, document gaps, readiness, notifications, explicit human review. | Inspect public demo/repository; submit contact. | Project hub/AI category → detail; detail → related review/operations evidence/About. | Direct project evidence; no client or outcome claims. | Dossier view, demo/repository CTA, share, contact. |
| P2 | Public-engagement or geospatial team needs map-based feedback and evidence of location-specific collaboration. | Find an interaction-design example. | `map based stakeholder feedback`, `geospatial public engagement UX`, `GIS collaboration interface` | `/projects/geovoice` | Project layers, location-specific comments, participant context, review workflow. | Inspect demo; submit contact. | Project hub → detail; detail → About and related systems. | Direct project evidence; no volume data. | Dossier view, demo CTA, share, contact. |
| P2 | Developers or researchers need practical writing about AI-as-user, ambiguity, and XR design. | Learn and discover an author. | `AI as user UX`, `designing interfaces for AI agents`, `emerging technology design ambiguity`, `XR design principles` | `/blog` and the four matching article summaries | Original Medium articles with unique on-site summaries and clear authorship. | Read the original article; then inspect relevant work or contact. | Primary nav → Blog; summaries → relevant projects/About; project dossiers → related writing. | Direct article metadata/summaries; on-site pages require strengthened internal links. | Summary views, outbound article selections, subsequent project/contact paths, Search Console queries. |

## Landing-page architecture decision

The existing product already supports the required acquisition architecture without creating
doorway pages:

1. `/` is the product/portfolio overview.
2. `/about` is both the operator/about page and the substantive how-it-works/operating-model page.
3. `/projects` is the examples/evidence hub.
4. `/projects/{id}` provides eleven unique detail pages with visible evidence and next actions.
5. `/blog` and its summaries form the resources/writing surface.

The first implementation pass should improve these authoritative surfaces instead of adding thin
keyword-variant routes. A new landing page is justified only when Search Console shows a distinct,
qualified intent that the existing information architecture cannot answer clearly.

## Validation cadence

- Week 0: record sitemap submission, indexed-page count, and zero/baseline query data.
- Weekly for the first month: review exclusions, query/page fit, branded vs nonbranded impressions,
  and crawl errors.
- Every two weeks: inspect pages with impressions but weak CTR before changing copy.
- Monthly: connect organic landing pages to engaged visits, Role Fit completions, and qualified
  contact submissions. Do not optimize toward pageviews alone.
- At 30 days or 100 qualified visits, whichever is later: reassess the event funnel and decide
  whether a dedicated intent page is supported by evidence.
