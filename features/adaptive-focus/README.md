# Adaptive Focus (Portfolio Integration)

This folder is intentionally split so the portfolio can stay a thin integration layer while the intelligence layer can be extracted later.

## What this public repo currently owns

- UI wiring in `app/projects/page.tsx`
- Public project metadata mapping in `config/metadata.ts`
- Local deterministic engine adapter (`adapters/local-engine.ts`)
- Feature facade (`index.ts`) used by the UI

## Internal structure

- `core/` pure parsing, ranking, and summary logic
- `adapters/` runtime engine implementations (local + remote stub)
- `config/` prompts, lexicon/synonyms, metadata mappings
- `types.ts` request/response and engine contracts

## Private extraction path

1. Move `core/` + sensitive `config/` weighting/synonym logic to a private package/service.
2. Replace `adapters/remote-engine.ts` with a real private adapter that implements `AdaptiveFocusEngine`.
3. Switch engine mode with `NEXT_PUBLIC_ADAPTIVE_FOCUS_ENGINE=remote` once private runtime is ready.
4. Keep `index.ts` facade and UI call sites unchanged.

This keeps migration low-risk and minimizes UI rewrites.
