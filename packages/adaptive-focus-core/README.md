# @mike/adaptive-focus-core

Deterministic core for Adaptive Focus v2. It is an in-repository package boundary and is not published.

## Responsibilities

- normalize and interpret local fallback text
- define the canonical `af.v2` contracts
- match typed role requirements to reviewed evidence
- preserve stable project ordering for ties
- compose factual summaries, requirement coverage, and gaps

The core does not import OpenAI, call a network service, read environment variables, or know about React components.

## Public contract

`AdaptiveFocusEngine.run(request, { signal })` is asynchronous so local and remote implementations share one UI contract. `AdaptiveFocusV2Result` returns:

- analysis source (`preset`, `gpt`, or `local-fallback`)
- structured role interpretation
- primary, supporting, and adjacent project IDs
- evidence references
- requirement-level coverage
- explicit gaps
- a deterministic summary

No raw scores or candidate-fit percentages are exposed.

## Ranking rules

- explicit requirements outrank inferred context
- required capabilities outrank preferred and contextual capabilities
- direct evidence outranks supporting evidence
- supporting evidence outranks adjacent evidence
- shipped/measured work, explicit ownership, and documented outcomes receive small strength bonuses
- company context has no ranking weight
- canonical project order breaks ties
- clarification states return no primary proof

## Extraction

A private service can later absorb the prompt, taxonomy evolution, evaluation set, and calibrated weighting while preserving the `af.v2` response shape. Public project data and reviewed evidence remain in the portfolio repository.
