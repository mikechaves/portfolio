# Portfolio Conversion Analytics

_Decision date: July 12, 2026_

## Decision

Use the existing Vercel Web Analytics integration for a small custom-event funnel. Do not add a
second analytics provider, session replay, identity tracking, or raw role-text capture.

The goal is to learn whether Adaptive Focus and reviewed project evidence help visitors reach a
case study, resume, contact action, or successful contact submission. Pageviews remain the general
traffic baseline; custom events answer only these product questions.

## Event Contract

| Event | Purpose | Allowed properties |
| --- | --- | --- |
| `adaptive_focus_started` | A visitor invoked a preset or custom role analysis. | `entry_point`, `mode` |
| `adaptive_focus_completed` | A Role Fit Brief completed. | `entry_point`, `mode`, `analysis_source`, `clarification_needed`, `requirement_count`, `primary_project_count` |
| `adaptive_focus_failed` | A requested analysis could not complete. | `entry_point`, `mode` |
| `project_evidence_opened` | A visitor opened project evidence from a measured surface. | `project_id`, `source`, `match_level` |
| `portfolio_conversion_clicked` | A visitor selected Role Fit, contact, or resume from a conversion surface. | `destination`, `source`, optional `project_id` |
| `portfolio_contact_submitted` | The contact action returned a successful response. | `source` |

## Privacy Posture

The analytics wrapper uses a runtime property allowlist. Fields outside the event contract are
dropped before the provider is called.

Do not send:

- custom role text or job descriptions
- normalized queries or model output
- names, email addresses, messages, or company names
- contact-form contents
- IP-derived identity or cross-site identifiers added by this application

Project IDs, predefined source labels, result counts, booleans, and engine-source labels are public
or bounded operational metadata. Vercel remains responsible for its platform-level data handling;
this repository does not add analytics persistence.

## Reliability

Analytics is non-blocking. Provider failures are caught and must not interrupt navigation, Adaptive
Focus, downloads, or contact submission. Tests verify the property allowlist and failure isolation.

## Evaluation Gate

Do not redesign the portfolio from a handful of events. Review the funnel after at least 30 days or
100 qualified visits, whichever is later. Use the results to answer:

1. Do visitors start and complete Adaptive Focus?
2. Do Role Fit Briefs lead to primary evidence more often than the default archive?
3. Which proof surfaces lead to resume or contact actions?
4. Are fallback or clarification states common enough to justify parser or UI work?

Low volume, bot traffic, and repeat visits limit attribution. Event counts indicate behavior, not
hiring intent or causality.
