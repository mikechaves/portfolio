# Portfolio Backlog

This directory is the active planning home for the portfolio site.

Use these backlog documents for current and future work. Pull request notes, review comments,
case-study drafts, and one-off planning conversations are context only unless the work is promoted
into one of these files.

## Source Of Truth

[Active Backlog](./ACTIVE_BACKLOG.md) and [Future Backlog](./FUTURE_BACKLOG.md) are the only
canonical work queues.

Other docs may contain decisions, evidence, runbooks, QA checklists, or historical context, but they
must not become shadow backlogs. If a review, audit, portfolio critique, or project update discovers
new work, do one of the following in the same change:

- Add near-term work to [Active Backlog](./ACTIVE_BACKLOG.md) with priority, ownerable scope, and
  validation criteria.
- Add deferred or decision-bound work to [Future Backlog](./FUTURE_BACKLOG.md).
- Mark the finding `DONE / SUPERSEDED` with a short rationale if it no longer applies.
- Keep validation-only checklists in their local docs only when they describe how to verify a
  feature, not what to build next.

## Canonical Files

- [Active Backlog](./ACTIVE_BACKLOG.md): current portfolio execution queue.
- [Future Backlog](./FUTURE_BACKLOG.md): deferred, long-range, or decision-bound work.

## Rules

- Add new work to a backlog, not to scattered notes.
- Do not leave roadmap commitments, follow-up tasks, or open findings only inside pull request
  descriptions, review comments, screenshots, or chat history.
- Keep completed work out of the active queue.
- Keep the active queue short enough to make real priority tradeoffs.
- Promote future work only when it has a clear validation path and a reason to beat the current
  queue.
