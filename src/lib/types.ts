// Data model — Phase 1 MVP (coding brief v2).
//
// Framing (brief §1): this is a base of evidence-based, citable strategies
// that a practitioner selects from and personalises. It is not a generator,
// and it makes no function-matching or ranking claims — see §2/§6.

// §2 — the six proactive categories. Multi-select: a strategy can
// legitimately sit in more than one (e.g. Health/Wellbeing overlapping
// Environmental is expected, not a data error). Deliberately NOT a function
// tag — function belongs to the behaviour (the FBA tool's job), not to the
// strategy. Deliberately NOT Primary/Secondary Prevention either — that was
// a timing framing in the seed source, not a type framing; seed entries are
// re-tagged into whichever of these six actually fits.
export type StrategyCategory =
  | 'environmental'
  | 'community'
  | 'communication'
  | 'regulating'
  | 'health_wellbeing'
  | 'learning'

export const STRATEGY_CATEGORY_LABELS: Record<StrategyCategory, string> = {
  environmental: 'Environmental',
  community: 'Community',
  communication: 'Communication',
  regulating: 'Regulating',
  health_wellbeing: 'Health and Wellbeing',
  learning: 'Learning',
}

// Reused verbatim from the FBA tool's 6-phase escalation cycle model
// (brief §2, §8 — "don't reinvent it"). Responsive strategies scale against
// this, not against a new taxonomy.
export type EscalationPhase =
  | 'baseline'
  | 'early_warning'
  | 'escalation'
  | 'peak_crisis'
  | 'de_escalation'
  | 'recovery'

export const ESCALATION_PHASE_LABELS: Record<EscalationPhase, string> = {
  baseline: 'Baseline',
  early_warning: 'Early warning',
  escalation: 'Escalation',
  peak_crisis: 'Peak/crisis',
  de_escalation: 'De-escalation',
  recovery: 'Recovery',
}

export type EvidenceTier =
  | 'systematic_review'
  | 'rct'
  | 'single_study'
  | 'practice_guide'
  | 'expert_consensus'
  | 'mixed_package_level' // §5 — merged/conflicting evidence for one technique

export const EVIDENCE_TIER_LABELS: Record<EvidenceTier, string> = {
  systematic_review: 'Systematic review',
  rct: 'Randomised controlled trial',
  single_study: 'Single study',
  practice_guide: 'Practice guide',
  expert_consensus: 'Expert consensus',
  mixed_package_level: 'Mixed evidence (package-level)',
}

// §3 — type-of-capacity flag, distinct from generic `prerequisites`. Exists
// so a practitioner doesn't personalise a strategy that's physically or
// cognitively mismatched to the person even when every other box is
// checked. Must render prominently at the point of personalisation.
export type CapacityConsideration = 'physical' | 'cognitive' | 'communication' | 'sensory'

export const CAPACITY_CONSIDERATION_LABELS: Record<CapacityConsideration, string> = {
  physical: 'Physical',
  cognitive: 'Cognitive',
  communication: 'Communication',
  sensory: 'Sensory',
}

export interface StrategySource {
  id: string
  citation: string // full citation text, e.g. "Hassiotis et al. (2018)..."
  studyType: string // free text — "cluster RCT (n=246)", "review-synthesis", etc.
  url: string | null
  notes: string | null
}

export interface StrategyTemplate {
  id: string
  version: number
  technique_name: string
  description: string // practitioner's own paraphrase, never copied text

  strategy_category: StrategyCategory[] // multi-select, see §2 — empty when is_responsive is true
  is_responsive: boolean // true = Responsive, not proactive; render separately (§2)

  population: string[] // disability/diagnostic groups the evidence actually covers
  evidence_tier: EvidenceTier
  evidence_summary: string // one honest sentence, including null/mixed findings (§5)
  sourceIds: string[] // FK to StrategySource, many-to-many

  prerequisites: string // generic conditions for use
  capacity_considerations: CapacityConsideration[] // §3
  capacity_considerations_note: string // practitioner-facing explanation of what to check

  contraindications: string
  measurement_guidance: string
  delivery_format: string

  supersededBy: string | null // nullable FK to another StrategyTemplate.id (§5)

  createdAt: string
}

// §5 — hard UI rule lives wherever a superseded StrategyTemplate is
// rendered: never show its headline figure without the superseding entry's
// result displayed alongside or instead of it. See StrategyDetail.tsx.

export interface Practitioner {
  id: string // single local profile, fixed id 'local-practitioner'
  name: string
  role: string
  disclaimerAcknowledgedAt: string | null
}

// PersonalisationRecord — local, participant-linked, version-pinned against
// the StrategyTemplate it was created from (brief §4: "the separation
// between template (shared, versioned) and personalisation (local,
// participant-linked, version-pinned) still holds"). Free text only — no
// auto-suggestion, matching the "assembles, doesn't generate" framing (§1).
export interface PersonalisationRecord {
  id: string
  strategyTemplateId: string
  strategyTemplateVersion: number // pinned at creation time
  participantIdentifyingDetails: string // kept logically separate, never joined into exports beyond this record
  personalisedActivity: string // free text, practitioner-authored
  rationale: string // free text, practitioner-authored
  escalationPhase: EscalationPhase | null // only meaningful for Responsive strategies
  createdBy: string
  createdAt: string
}
