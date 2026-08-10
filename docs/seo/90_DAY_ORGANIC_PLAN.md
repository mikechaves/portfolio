# 90-Day Organic Acquisition Plan

_Plan start: first production deployment containing the SEO acquisition system_

Use `OWNER_ACTION_CHECKLIST.md` for the ordered release/account handoff and
`PAGE_EXPERIENCE_AUDIT.md` for the repository lab baseline. Day 0 begins only after the exact
reviewed commit is deployed to the public canonical host.

## KPI sequence

Evaluate progress in this order. A downstream metric is not healthy if the upstream coverage is
unknown.

1. Valid indexed pages
2. Search impressions
3. Nonbranded search clicks
4. Click-through rate
5. Engaged organic visits
6. Primary product actions (Adaptive Focus starts and completions)
7. Organic visitor-to-conversion rate (`generate_lead` contact submissions)
8. Returning organic users

No traffic-growth percentage is forecast until Search Console and GA4 establish a baseline.

## Days 0-30: establish trustworthy coverage

### Technical corrections

- Deploy the canonical-host, metadata, sitemap, robots, structured-data, 404, and preview-noindex
  implementation.
- Verify the exact production SHA at `https://www.mikechaves.io` and re-run the production crawl.
- Submit `https://www.mikechaves.io/sitemap.xml` to a Search Console Domain property.
- Inspect `/`, `/about`, `/projects`, `/projects/x-games`, and `/blog/voice-first-xr`.
- Resolve only explained Search Console exclusions; do not force index low-value pages.

### Measurement

- Create or connect the GA4 web data stream and set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel
  Production only.
- Verify consent acceptance, one sanitized `page_view` per route, Adaptive Focus start/completion,
  case-study share, meaningful failure, and successful contact `generate_lead` in DebugView and
  Realtime.
- Enable Vercel Web Analytics and Speed Insights for the `portfolio` project if plan allocation
  permits, then confirm production data rather than assuming the SDK is sufficient.
- Record the first Search Console, GA4, and field-CWV snapshots in the implementation report.

### High-intent landing pages and internal links

- Treat `/`, `/about`, and `/projects` as the first three acquisition surfaces; verify their query
  language and conversion paths rather than creating new pages immediately.
- Add contextual links from relevant article summaries into the strongest supporting dossiers.
- Confirm every project dossier has breadcrumbs, related evidence, and a clear Role Fit/contact/share
  path.

## Days 31-60: deepen evidence where demand appears

### Public examples and product-led content

- Use Search Console query/page pairs to select two dossiers with qualified impressions but weak
  coverage.
- Improve those dossiers with additional approved artifacts, explicit interaction instructions,
  implementation constraints, and update context already supported by public evidence.
- Publish no generated page unless it passes the public-quality gate in
  `ROUTE_INDEXABILITY_MAP.md`.

### Documentation and founder-led analysis

- Turn one recurring, evidence-backed product question into original analysis, such as the design
  of human review in AI-generated systems or the difference between model evaluation and workflow
  calibration.
- Link the analysis to the relevant public cases and disclose limitations; do not convert private
  work into public examples.
- Refresh one article summary with a clearer answer, supporting case link, and publication/update
  date when the original source supports it.

### Conversion experiments

- Compare Role Fit completion and qualified contact rates by organic landing-page group.
- Test one copy/hierarchy change at a time on an existing CTA; do not redesign from low-volume
  directional data.
- Preserve the analytics event contract so pre/post data remains comparable.

## Days 61-90: compound proven topics

### Internal-linking improvements

- Use Search Console and GA4 path data to identify valuable pages more than two clicks from Home or
  pages with impressions but few internal entrances.
- Add only meaningful contextual relationships; avoid generic “related” grids.
- Review anchor text for clarity and accessibility rather than exact-match repetition.

### Digital PR and legitimate external references

- Share original, evidence-backed analysis with relevant professional communities, conference
  contacts, and project collaborators where it is genuinely useful.
- Request corrections or references only from organizations already connected to the public work;
  do not trade, buy, automate, or mass-request backlinks.
- Keep employer-approved public evidence and confidential experience boundaries unchanged.

### Distribution through existing channels

- Distribute one strong project or analysis through the existing LinkedIn, X, GitHub, and Medium
  profiles with a canonical portfolio link.
- Add source/medium/campaign UTMs only to owned distribution links; never expose private role text
  or visitor identifiers.
- Compare assisted Role Fit/contact outcomes, not just referral volume.

### Search Console review cadence

- Weekly: Page indexing, sitemap processing, crawl errors, security issues, and manual actions.
- Biweekly: nonbranded query/page pairs, CTR opportunities, cannibalization, and unexpected
  canonical selections.
- Monthly: Core Web Vitals by template, structured-data reports, top organic landing pages, and
  conversion quality.
- At day 90: decide whether evidence supports a new substantive landing page, a deeper existing
  dossier, or continued consolidation. Do not create keyword-variant pages by default.

## Ongoing guardrails

- Do not publish traffic or conversion claims without a stable baseline and documented date range.
- Do not index private, failed, incomplete, duplicate, filtered, or query-generated content.
- Do not invent reviews, ratings, users, customers, partnerships, awards, or performance metrics.
- Do not use `llms.txt`, mass AI content, doorway pages, hidden text, or backlinks as ranking hacks.
- Treat Lighthouse as lab evidence, not proof of field Core Web Vitals or search performance.
