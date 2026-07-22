# Site-Wide Release Acceptance

## Scope

This acceptance baseline covers the public project curation, professional-experience disclosure model, Adaptive Focus evidence entities, and former proprietary route behavior.

## Journey

1. Homepage positioning and Adaptive Focus entry.
2. Local preset handoff into a Role Fit Brief.
3. Public project proof with inspectable case-study routes.
4. Confidential or approved-public professional evidence with no media or project route.
5. About-page professional experience, resume, and contact paths.
6. The same path at desktop and 390px mobile.

## Accepted Behavior

- Homepage featured proof is Wizzo, X Games, and SpeakEasy.
- The public archive contains eleven explicitly curated public projects.
- Games & Interactive is a virtual project category and does not alter the project category type.
- Human-in-the-loop roles can surface high-level confidential employment evidence without internal artifacts.
- LLM evaluation roles can surface employer-approved public experience without creating a project case study.
- Requirement coverage resolves company and project names without exposing raw entity IDs.
- Professional evidence never enters the project-card archive, related-project routes, dossier counts, or immersive navigation.
- Former proprietary routes redirect server-side to the professional-experience section.
- Removed proprietary media paths return `404`.
- GeoVoice remains a public, inspectable case study.

## Evidence Limits

- Public project screenshots support visual hierarchy, responsiveness, and route continuity; they do not establish full WCAG conformance.
- Professional summaries disclose only approved high-level evidence and contain no internal media.
- Current-tree removal does not erase historical Git commits, prior deployments, forks, or external caches.
- The downloadable resume requires a separate content and permissions review for exact outcome metrics.

## Validation

- `pnpm lint`
- `pnpm type-check`
- `pnpm test:unit`
- `pnpm check:links`
- `pnpm build`
- `pnpm test:visual-smoke`
- Desktop and mobile browser QA for homepage, projects, Adaptive Focus presets, About, redirects, and retired assets.

Final result is recorded in the pull request and deployment report for the migration.
