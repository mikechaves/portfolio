# Projects Archive Signal Index Design QA

## Reference

- Production baseline: `/tmp/projects-archive-production-before.png`
- Signal index implementation: `/tmp/projects-archive-local-desktop.png`
- Side-by-side comparison: `/tmp/projects-archive-comparison.png`
- Desktop viewport: 1280 x 720

## Product Intent

The production archive opened as a terminal introduction followed by a large role-analysis form. The signal-index iteration preserves the existing Adaptive Focus workflow and project ordering while turning the archive into a clearer evidence navigation surface: archive status, reviewed dossier volume, role lenses, category counts, and indexed project records.

## Visual Review

- The visible H1 now establishes the archive as a Project Signal Index and matches the homepage and evidence-dossier display hierarchy.
- The header ledger uses repository-derived values for project and dossier counts.
- Adaptive Focus is presented as a compact command deck with indexed preset lenses, without changing engine behavior.
- Category controls show repository-derived result counts and preserve pressed-state semantics.
- Project entries retain real project media and the existing card component while adding record numbers and evidence-dossier markers.
- The first two reviewed dossiers are visually distinct without changing canonical project order.
- Responsive rules collapse the header, lenses, categories, and project grid to single-column layouts below the existing mobile breakpoint.

## Interaction And Accessibility

- The page has one visible semantic H1 and ordered H2 sections.
- Category buttons retain `aria-pressed`, keyboard focus rings, and deterministic filtering.
- The AI category showed six records and the Human-in-the-loop AI preset produced a Role Fit Brief with the archive in relevance order.
- Adaptive Focus request status remains in the existing polite live region.
- Browser interaction checks produced no console errors.
- Reduced-motion handling remains inherited from the shared signal-card system.

## Validation

- `pnpm test`: 76 tests passed
- `pnpm lint`: passed
- `pnpm check:links`: passed
- `pnpm build`: passed

final result: passed
