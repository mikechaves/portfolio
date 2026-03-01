# @mike/adaptive-focus-core

Internal core module for Adaptive Focus.

## Current status

- Lives in this repository for active iteration.
- Consumed by portfolio adapters as an internal package boundary.
- Not published yet (`private: true`).

## Planned promotion path

1. Add build output (e.g., `dist/`) and exports map.
2. Move package to private registry/repository.
3. Flip consumers from relative path imports to `@mike/adaptive-focus-core`.

## Public API (current)

- `parseIntent`
- `normalizeIntentInput`
- `rankProjects`
- `createSummary`
- Core adaptive types
