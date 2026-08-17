# Strategy Library

A base of evidence-based, citable positive-behaviour-support strategies that
practitioners select from and personalise for an individual. The system
assembles and surfaces options from published evidence; the practitioner
always authors the final selection, personalisation, and rationale. This is
explicitly **not a generator**.

Sibling product to [fba-screener](https://github.com/DaddysCoder/fba-screener) —
same practitioner, same regulatory posture (NDIS Quality & Safeguards
Commission's Feb 2026 position statement against AI-generated clinical
content and automated decision-making without clinical judgement), same
architecture philosophy: local-first PWA, Dexie/IndexedDB, no ranking or
"recommended for this case" logic.

## Phase 1 scope

- Seed library, categorised into the six proactive `strategy_category`
  values (environmental, community, communication, regulating,
  health_wellbeing, learning — multi-select) plus a separate `Responsive`
  section scaled against the FBA tool's 6-phase escalation cycle.
- Browse/filter by category (multi-select) and evidence tier; Responsive
  strategies live in their own section, never mixed into the category
  filter.
- `capacity_considerations` render prominently at the point of
  personalisation — a safety check, not buried metadata.
- `PersonalisationRecord`: free-text personalised activity + rationale, no
  auto-suggestion, version-pinned to the `StrategyTemplate` it was created
  from.
- Export personalised entries to plan-ready HTML (print-to-PDF), matching
  the FBA tool's `DocumentationExport` pattern.
- `superseded_by` is a first-class UI concern: a superseded strategy's
  headline evidence figure is never shown without the superseding result
  alongside it (see `strat-pbs-carer-training-pilot` /
  `strat-pbs-carer-training-rct` in `src/lib/seedData.ts` for the concrete
  case this enforces).

Explicitly excluded from Phase 1: FunctionHypothesis matching from the FBA
tool (Phase 5+), any function-based tagging of strategies, multi-practitioner
content workflows, and any ranking/recommendation logic beyond static
category/filter browsing.

## Content honesty in the seed data

`src/lib/seedData.ts` documents its own honesty rules: no invented study
numbers or effect sizes beyond what's in the coding brief, and entries
without a specific extracted source are marked `practice_guide` /
`expert_consensus` rather than given a fabricated citation. Regulating,
Community, and Health/Wellbeing are launched deliberately sparse rather than
backfilled with invented evidence.

## Stack

Vite + React + TypeScript + Tailwind v4 + Dexie/IndexedDB + react-router,
matching the FBA tool's stack. `useLiveQuery` normalizes "no record found"
to `null` (see `src/lib/practitioner.ts`) to avoid the loading/not-found
ambiguity the FBA tool hit.

## Development

```sh
npm install
npm run dev      # local dev server
npm test         # vitest
npm run build    # tsc -b && vite build
```
