# Portfolio Acquisition and Conversion Analytics

_Current decision: August 9, 2026_

## Decision

Use GA4 as the consent-gated acquisition and conversion layer required by the organic-acquisition
program. Retain Vercel Web Analytics as a production-only, first-party aggregate cross-check and
add Vercel Speed Insights for field Core Web Vitals. This supersedes the July 12, 2026 Vercel-only
provider decision while preserving its bounded event contract and privacy rules.

The systems are not interchangeable:

| System | Purpose | Transport boundary |
| --- | --- | --- |
| GA4 | Acquisition source/landing-page analysis and the real product/conversion funnel. | Loads only on Vercel Production, with a valid `NEXT_PUBLIC_GA_MEASUREMENT_ID`, after explicit consent. |
| Vercel Web Analytics | Simple first-party traffic trends and bounded custom-event cross-checks. | Component and custom-event transport run only when `VERCEL_ENV=production`; dashboard must also be enabled by the owner. |
| Vercel Speed Insights | Route-level real-user LCP, INP, CLS, FCP, and TTFB. | Component runs only when `VERCEL_ENV=production`; field data requires deployment, dashboard enablement, and real visits. |
| Local debug buffer | Deterministic verification without contaminating production data. | `NEXT_PUBLIC_ANALYTICS_DEBUG=1` captures sanitized GA4-shaped events in a reload-bounded browser session buffer; Google and Vercel requests remain blocked. |

Vercel is retained because it provides a privacy-oriented operational view and field-performance
surface independent of GA4 attribution. It is not a ranking mechanism, and agreement between two
providers is not treated as two conversions.

## Environment and consent contract

| Environment/state | GA4 | Vercel Analytics | Speed Insights |
| --- | --- | --- | --- |
| Local development | Off | Off | Off |
| Automated tests | Off; debug buffer only in `analytics:audit` | Off | Off |
| Vercel Preview | Off, even if a measurement ID is present | Off | Off |
| Vercel Production, optional consent unknown/denied | Off | On if owner enabled the dashboard | On if owner enabled the dashboard |
| Vercel Production, optional consent granted | On | On if owner enabled the dashboard | On if owner enabled the dashboard |

The optional preference is stored as `granted` or `denied` under
`portfolio.analytics-consent.v1`. Unknown consent fails closed. The footer reopens preferences.
Global Privacy Control or Do Not Track keeps optional GA4 off and prevents an in-product override.
Revoking consent stops event delivery and removes visible `_ga*` cookies for the serving and base
domains.

GA4 initializes with manual pageviews (`send_page_view: false`), advertising storage and signals
disabled, and no script at all before permission. Vercel remains separate and cookieless; the
preference copy states that boundary rather than implying the optional choice disables operational
Vercel telemetry.

## Event contract

All properties pass through the runtime allowlist in `lib/portfolio-analytics.ts`. GA4 mapping is
defined in `lib/analytics/ga4.ts`.

The zero-framework-runtime Home and About routes mirror those same allowlist and mapping contracts
in one small deferred analytics bridge. It preserves the same consent storage key and
reload-bounded debug session, so a deliberate full-page handoff between Pages and App Router routes
carries only sanitized GA4-shaped events. The automated audit exercises that cross-router handoff
and rejects provider requests in debug mode.

| App/GA4 event | Trigger | Allowed parameters | GA4 meaning | Business meaning |
| --- | --- | --- | --- | --- |
| `page_view` | First consented view of a pathname and each subsequent client-side pathname change. Query and hash are removed; the same pathname is sent once per document lifecycle. | `page_path`, canonical `page_location`, `page_title`, `page_group` | Recommended GA4 pageview. | Acquisition landing page and navigation baseline. |
| `adaptive_focus_started` | A visitor invokes a preset or custom Role Fit analysis. | `entry_point`, `mode` | Product-specific event. | Primary product action started. |
| `adaptive_focus_completed` | A Role Fit Brief returns a result. | `entry_point`, `mode`, `analysis_source`, `clarification_needed`, `requirement_count`, `primary_project_count` | Product-specific event; configure as a GA4 key event after deployment. | Primary product action completed. |
| `adaptive_focus_failed` | A requested Role Fit analysis cannot complete. | `entry_point`, `mode` | Product-specific error event. | Meaningful primary-action failure. |
| `project_evidence_opened` → `select_content` | A measured card or related-evidence link opens a project. | `project_id`, `source`, `match_level` | Recommended content selection. | Evidence progression by surface and relevance level. |
| `article_original_opened` → `select_content` | A summary reader selects the original Medium article. | `article_id`, `source` | Recommended content selection. | Resource engagement beyond the on-site summary. |
| `portfolio_conversion_clicked` → `select_content` | A Role Fit, contact, or resume action is selected. | `destination`, `source`, optional `project_id` | Recommended content selection. | Conversion-path intent before completion. |
| `project_shared` → `share` | Native share succeeds or canonical URL copy succeeds. Cancellations are not counted. | `method`, `project_id`, `source` | Recommended share event. | Secondary case-study distribution action. |
| `portfolio_contact_submitted` → `generate_lead` | The protected same-origin contact endpoint returns success. | `source`; GA4 adds bounded `method=contact_form` | Recommended lead event; configure as a GA4 key event. | Primary business conversion. |
| `portfolio_contact_failed` → `contact_form_error` | Configuration, validation, delivery, or unexpected contact failure. | `failure_type`, `source` | Product-specific error event. | Meaningful business-conversion failure. |

There is no signup, account-registration, newsletter, or waitlist flow in the public product. A
signup/waitlist completion event is therefore not implemented. The actual successful contact action
uses GA4's recommended `generate_lead` event; adding a synthetic signup event would corrupt the
funnel.

## Page groups

Only stable pathname-derived groups are sent:

- `portfolio_overview`
- `operator_and_contact`
- `project_hub`
- `project_detail`
- `writing_hub`
- `article_summary`
- `utility`

Search parameters such as `focusPreset`, `focusBrief`, and `focusSession` are never sent. A custom
role or job description may affect the on-device/application experience but never the analytics
payload.

## Prohibited data

Never send:

- custom role text, job descriptions, normalized queries, or model output;
- names, email addresses, messages, company names, or contact-form contents;
- source-post/article content, prompts, generated private material, or private evidence IDs;
- full URLs containing search parameters, fragments, or temporary handoff tokens;
- IP-derived identity, user IDs, advertising identifiers, or cross-site identifiers added by this
  application.

Allowed values are public project/article IDs, predefined source labels, bounded result counts,
booleans, failure categories, and engine-source labels. Analytics is non-blocking and provider
failures cannot interrupt navigation, Adaptive Focus, sharing, downloads, or contact submission.

## Verification

Automated verification:

```bash
pnpm analytics:audit
```

The command builds with local debug mode, exercises allow/decline/persistence, records exactly one
pageview per visited pathname, invokes Adaptive Focus and sharing through the real UI, and fails if
any request targets Google Analytics, Google Tag Manager, Vercel Web Analytics, or Speed Insights.

Manual development inspection:

```bash
NEXT_PUBLIC_ANALYTICS_DEBUG=1 pnpm dev
```

After allowing optional analytics, inspect:

```js
window.__portfolioAnalyticsDebugEvents
```

This array contains only GA4-shaped, allowlisted events. Debug mode carries that sanitized evidence
across deliberate full-page route changes so the complete funnel can be asserted, then clears it on
an explicit reload. Debug mode never enables provider transport and is explicitly disabled when
`VERCEL_ENV=production`.

After the production environment variables and dashboards are configured, verify the same contract
in GA4 DebugView/Realtime and Vercel dashboards. Repository tests do not prove that account-level
collection is enabled.

## Owner setup after deployment

1. Create or select the GA4 web data stream for `https://www.mikechaves.io`.
2. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel Production only; do not add it to Preview or
   Development.
3. Deploy, allow optional analytics in a controlled browser, and confirm one canonical pageview per
   pathname plus the bounded events in DebugView/Realtime.
4. Mark `adaptive_focus_completed` and `generate_lead` as GA4 key events. Do not mark every click as
   a conversion.
5. Enable Vercel Web Analytics and Speed Insights for project `portfolio` if plan allocation permits,
   then confirm observations in both dashboards.
6. Record the deployment SHA, verification date, and first field-data snapshot in the SEO
   implementation report.

## Evaluation gate

Do not redesign the portfolio from a handful of events. Review the funnel after at least 30 days or
100 qualified visits, whichever is later. Segment organic landing pages from direct/internal QA,
inspect upstream index/impression data first, and treat event counts as behavior—not hiring intent or
causality.
