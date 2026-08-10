# Route Indexability Map

_Decision date: 2026-08-09_

Canonical origin: `https://www.mikechaves.io`

## Public and indexable

| Route | Content role | Search intent | Canonical rule | Sitemap |
| --- | --- | --- | --- | --- |
| `/` | Portfolio/product overview and Adaptive Focus entry | AI-native design engineer; product design engineer | Self | Yes |
| `/about` | Operator profile, working model, professional evidence, and contact | Mike Chaves; AI product design approach; human-in-the-loop product work | Self; ignore `focus` query | Yes |
| `/projects` | Examples/evidence hub and Role Fit Brief workflow | AI product portfolio; game UX portfolio; design engineering case studies | Self; ignore all filter/handoff queries | Yes |
| `/projects/wizzo` | AI mentor/product-system evidence dossier | AI mentor product design; AI workflow UX | Self | Yes |
| `/projects/x-games` | Playfold AI-native game-platform evidence dossier | AI game platform; creator tools; social game design | Self; retain stable route ID after public rename | Yes |
| `/projects/speakeasy` | Voice-first XR accessibility evidence dossier | voice-first XR accessibility; inclusive spatial interaction | Self | Yes |
| `/projects/sound-escape-vr` | Spatial music interaction evidence dossier | VR music interface; audio-reactive interaction | Self | Yes |
| `/projects/material-explorer` | Browser-based PBR tooling evidence dossier | web PBR material editor; interactive 3D tools | Self | Yes |
| `/projects/geovoice` | Geospatial stakeholder-feedback evidence dossier | map-based public engagement; geospatial collaboration UX | Self | Yes |
| `/projects/vulnerability-visualizer` | Security-review dashboard evidence dossier | vulnerability visualization; security review dashboard | Self | Yes |
| `/projects/petition-ready` | Human-reviewed legal-operations evidence dossier | AI legal intake workflow; paralegal case-readiness UX | Self | Yes |
| `/projects/creative-supply-engine` | AI creative-operations evidence dossier | creative operations automation; human-reviewed AI assets | Self | Yes |
| `/projects/portals` | Voice-first AR cultural-navigation evidence dossier | voice AR interaction; spatial cultural navigation | Self | Yes |
| `/projects/die-ai` | Browser-game preservation evidence dossier | Flash game preservation; browser emulation case study | Self | Yes |
| `/blog` | Writing/resources hub | AI-native UX writing; XR accessibility writing | Self; ignore `focus` query | Yes |
| `/blog/voice-first-xr` | Unique summary and original-article path | voice-first XR lessons; accessible spatial computing | Self | Yes |
| `/blog/embracing-ambiguity` | Unique summary and original-article path | design ambiguity; emerging technology design | Self | Yes |
| `/blog/ai-becomes-user` | Unique summary and original-article path | AI as user; agent-facing UX | Self | Yes |
| `/blog/extended-pausabilities` | Unique summary and original-article path | XR accessibility design | Self | Yes |
| `/blog/redefining-reality` | Unique summary and original-article path | XR design principles; spatial interface design | Self | Yes |

## Public but noindex

| Route | Reason | Robots rule | Links |
| --- | --- | --- | --- |
| `/archive` | Deliberately lower-prominence legacy prototype with synthetic-data disclosure; useful historical context but not an acquisition target. | `noindex, follow` | Keep footer and current-project links crawlable. |
| `/error` | Utility state with a query-provided message and no durable search value. | `noindex, nofollow` | Link home only. |
| `/_not-found` and any unknown route | Error response, not content. | Framework 404/noindex | Link to useful recovery destinations. |

## Private or authenticated

There are no repository-level authenticated application pages. Vercel Authentication protects:

- immutable deployment URLs,
- branch preview URLs,
- production deployment URLs outside the custom domains.

Those surfaces are deployment infrastructure and must not be added to metadata, canonicals, links,
or the sitemap.

## API and infrastructure

| Pattern | Classification | Indexation behavior |
| --- | --- | --- |
| `/api/adaptive-focus/analyze` | Server API | Excluded from sitemap; disallowed in production robots policy. |
| `/api/placeholder` | Generated placeholder image API | Excluded from sitemap; disallowed in production robots policy. |
| `/_next/*` | Framework assets/data | Not sitemap content; do not block assets required for rendering. |
| `/favicon/*`, `/projects/*.{png,jpg,jpeg,mp4,pdf,html}`, `/events/*`, `/visuals/*`, `/data/*` | Public assets | Not page URLs; may be crawled when referenced, never added as sitemap pages. |
| `/robots.txt` | Crawl policy | Public text response. |
| `/sitemap.xml` | Curated discovery feed | Public XML response containing only the indexable table above. |

## Redirects and removed routes

| Source | Destination/status | Rationale |
| --- | --- | --- |
| `http://mikechaves.io/*` | HTTPS edge redirect, then canonical host | Existing Vercel behavior; owner can later remove the extra apex HTTP hop at the domain layer. |
| `https://mikechaves.io/*` | 308 to `https://www.mikechaves.io/*` | Canonical-host consolidation; preserve path and query. |
| `http://www.mikechaves.io/*` | 308 to HTTPS canonical host | HTTPS enforcement. |
| Stable Vercel aliases | 308 to the canonical host | Prevent duplicate public origins; preserve path and query. |
| `/projects/ai-energy-consumption` | 308 to `/archive#ai-energy-context-explorer` | Intentional archival move. |
| `/projects/astrocade-qa-calibration-tool` | 308 to `/about#professional-experience` | Retired public case study consolidated into approved professional evidence. |
| `/projects/apt-plus` | 308 to `/about#professional-experience` | Retired public case study consolidated into approved professional evidence. |
| `/projects/gaia` | 308 to `/about#professional-experience` | Retired public case study consolidated into approved professional evidence. |
| `/projects/transcribe` | 308 to `/about#professional-experience` | Retired public case study consolidated into approved professional evidence. |
| `/projects/{unknown}` | 404 | Unknown content must not redirect to an indexable error or homepage. |
| `/blog/{unknown}` | 404 | Framework not-found response. |

## Duplicate and noncanonical variants

| Variant | Canonical target | Indexation decision |
| --- | --- | --- |
| `/?metaverse=true` | `/` | Interactive mode of the same overview; canonicalize to `/`. |
| `/projects?focusPreset=*` | `/projects` | Personalized/filter state; canonicalize to the hub. |
| `/projects?focusBrief=*` | `/projects` | Encoded handoff state; canonicalize to the hub and never put its value in analytics. |
| `/projects?focusSession=1` | `/projects` | Ephemeral session handoff; canonicalize to the hub. |
| `/blog?focus=*` | `/blog` | Context label only; canonicalize to the hub. |
| `/about?focus=*` | `/about` | Context label only; canonicalize to the profile. |
| Any sort/filter/query combination not named above | Same pathname without query | Do not add to sitemap; canonicalize to the substantive route. |

## Quality gate for future public content

A project or article may enter the sitemap only when it:

1. is explicitly curated as public;
2. returns 200 at its canonical path;
3. has a unique title, description, H1, social preview, and substantive initial HTML;
4. includes accurate visible evidence and a next action;
5. is not private, failed, incomplete, retired, duplicate, or generated solely from a query variant;
6. passes the automated SEO audit.

Private or failed generated material is not represented in the current public data model. If a
future generator adds public pages, publication state and uniqueness must be explicit data fields;
absence of a failure flag is not sufficient evidence for indexability.
