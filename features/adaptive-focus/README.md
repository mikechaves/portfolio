# Adaptive Focus (Portfolio Integration)

This folder is intentionally split so the portfolio can stay a thin integration layer while the intelligence layer can be extracted later.

## What this public repo currently owns

- UI wiring in `app/projects/page.tsx`
- Public project metadata mapping in `config/metadata.ts`
- Local deterministic engine adapter (`adapters/local-engine.ts`)
- Feature facade (`index.ts`) used by the UI

## Internal structure

- `adapters/` runtime engine implementations (local + remote stub)
- `config/` prompts + public metadata mappings
- `types.ts` request/response and engine contracts
- `../../packages/adaptive-focus-core/src` in-repo stand-in for the future private core package/service

## Private extraction path

1. Promote `packages/adaptive-focus-core` to a private package/service (same exported functions).
2. Keep public metadata in this repo; move sensitive weights/synonym expansion into the private core.
3. Replace `adapters/remote-engine.ts` with a real private adapter that implements `AdaptiveFocusEngine`.
4. Switch engine mode with `NEXT_PUBLIC_ADAPTIVE_FOCUS_ENGINE=remote` once private runtime is ready.
5. Keep `index.ts` facade and UI call sites unchanged.

This keeps migration low-risk and minimizes UI rewrites.
