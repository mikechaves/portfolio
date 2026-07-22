# Adaptive Focus v2

Adaptive Focus builds a Role Fit Brief from a role, responsibility set, or predefined lens. The product separates probabilistic interpretation from deterministic portfolio claims:

1. GPT interprets custom role text into the bounded `RoleInterpretation` contract.
2. Presets and fallback requests use the local token- and phrase-aware interpreter.
3. The evidence matcher ranks only static, reviewed portfolio evidence.
4. The UI resolves evidence-entity IDs as either public projects or professional-experience summaries and shows coverage and gaps.

GPT never receives portfolio project data and never ranks projects or writes portfolio evidence.

## Runtime paths

### Presets

The seven visible presets contain predefined interpretations in `config/presets.ts`. They run locally, make no model request, and may be linked with `?focusPreset=<id>`.

### Custom role text

The homepage analyzes custom text first, writes a versioned edit-recovery payload to `sessionStorage`, and navigates with a compact `focusBrief` token containing only bounded capability enums, role family, seniority, confidence, and analysis source. The token never contains the original role text, responsibilities, company, or model prose. The Projects page removes the temporary session payload immediately after reading it; browsers that isolate session storage still receive the derived brief and a human-readable editable capability list.

`POST /api/adaptive-focus/analyze` validates the text, calls the server-only OpenAI interpreter, and then composes the brief from the public evidence catalog. The endpoint:

- accepts only `{ input: string }`
- limits input to 12,000 characters
- sets `Cache-Control: no-store`
- does not log raw input or model output
- sets `store: false` on the Responses API request
- returns sanitized errors

The site does not persist role text. OpenAI API data controls and abuse-monitoring retention may still apply, so the UI tells visitors not to submit confidential or identifying information.

### Local fallback

If the server request fails, the hybrid browser engine runs the local parser and evidence matcher. The result is marked `analysisSource: "local-fallback"` and disclosed in the UI. Company-only and low-confidence inputs preserve canonical evidence order and ask for clarification.

## Evidence catalog

`evidence/catalog.ts` contains factual, reviewed records sourced from public case studies and approved professional summaries. Every evidence entity must have evidence or an explicit exclusion. Integrity tests reject unknown entity IDs, duplicate evidence IDs, invalid source paths, and uncovered entities.

Public projects and professional experience are separate registries. Professional records may rank in a Role Fit Brief but never enter public project counts, cards, categories, navigation, or routes. Confidential records use a non-linked shield treatment; employer-approved public summaries use a distinct verified treatment. See `docs/content/PROFESSIONAL_EXPERIENCE_EVIDENCE.md` for the disclosure contract.

Evidence records include:

- capability
- factual statement
- source path and section
- evidence type
- ownership
- direct, supporting, or adjacent strength
- documented outcome when available

AI category membership is derived from evidence capabilities and then restricted to public project IDs.

## OpenAI configuration

```text
OPENAI_API_KEY=
OPENAI_ADAPTIVE_FOCUS_MODEL=gpt-5-mini
```

The implementation uses the Responses API, `responses.parse`, Structured Outputs through `zodTextFormat`, low reasoning effort, no tools, no conversation state, and `store: false`.

Tests mock the SDK and never make live API calls. No live-evaluation command runs in CI or through `pnpm test`.

## Production controls

Vercel production should configure:

- a dedicated portfolio OpenAI project/key
- a monthly project budget and usage alerts
- infrastructure-level or Vercel Firewall rate limiting for `/api/adaptive-focus/analyze`
- server-only environment variables

The repository intentionally does not use an in-memory serverless rate limiter or add a persistence service solely for rate limiting.

## Private extraction path

The public repository currently owns the UI, API contract, presets, fallback parser, reviewed public project evidence, approved professional summaries, and deterministic brief rendering. A future private service can own prompt instructions, schema evolution, advanced taxonomy, evaluation fixtures, model selection, evidence weighting, ranking calibration, and usage-derived tuning.

The async `AdaptiveFocusEngine` and `af.v2` ID-based response contract allow that service to replace the server interpreter without rewriting the Role Fit Brief UI.
