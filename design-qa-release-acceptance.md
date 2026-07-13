# Site-Wide Release Acceptance

## Reference

- Production site: `https://www.mikechaves.io`
- Desktop viewport: 1440 x 900
- Mobile viewport: 390 x 844
- Captured evidence: `/tmp/portfolio-release-audit/01-home-desktop.png` through
  `/tmp/portfolio-release-audit/11-contact-mobile.png`
- Audit date: July 12, 2026

## Journey

1. Homepage positioning and Adaptive Focus entry
2. Local preset handoff into a Role Fit Brief
3. Primary Astrocade evidence dossier
4. Related evidence, Role Fit Brief, resume, and contact exit paths
5. About-page contact destination
6. The same path at 390px mobile

## Accepted Behavior

- Homepage positioning, primary actions, Adaptive Focus lenses, and featured evidence are present in
  the first desktop viewport.
- The Human-in-the-loop AI preset initializes a deterministic Role Fit Brief without a model request.
- Astrocade appears as primary proof with reviewed evidence, requirement coverage, and traceable case
  study links.
- Evidence dossiers expose related projects, a capability-preserving Role Fit Brief action, resume
  access, and a direct contact path.
- The contact destination includes availability, professional links, explicit form labels, required
  fields, pending state, and status feedback.
- Desktop and mobile checks produced no browser warnings or errors.
- At 390px, audited routes had no horizontal overflow and the dossier remained readable through its
  final conversion actions.

## Release Fixes

- Preserve acronym casing in Adaptive Focus summaries, explanations, gaps, and role-family labels.
- Add scroll clearance so the mobile contact heading is not hidden beneath sticky navigation.
- Remove the completed thumbnail-crop item from Future Backlog and record the completed dossier and
  acceptance baseline in Active Backlog.

## Evidence Limits

- Screenshots support visual hierarchy, responsiveness, and route continuity; they do not establish
  full WCAG conformance.
- The audit did not submit the production contact form or send personal information.
- External link syntax and local asset coverage remain part of the repository validation suite.

## Validation

- `pnpm test`
- `pnpm lint`
- `pnpm check:links`
- `pnpm build`
- Production browser QA on homepage, projects, Astrocade, and About/contact

final result: passed
