import { db } from './db'
import type { StrategySource, StrategyTemplate } from './types'

// Seed content — re-tagged against the v2 schema (brief §7: "None have
// strategy_category or capacity_considerations assigned yet — that
// re-tagging pass ... is the next content task"). This module IS that pass.
//
// Content honesty rules followed throughout:
// - No invented study numbers/effect sizes beyond what the coding brief
//   itself supplied (Crates & Spicer n=32; Hassiotis 2009 pilot n=63 /
//   43%; Hassiotis 2018 cluster RCT n=246, null).
// - Entries without a specific extracted source use evidence_tier
//   'practice_guide' or 'expert_consensus' and an honest, non-specific
//   evidence_summary rather than a fabricated citation.
// - Regulating, Community, and Health/Wellbeing are launched sparse, per
//   §7 — deliberately not backfilled with invented evidence just to fill
//   the categories out.

export const SOURCES: StrategySource[] = [
  {
    id: 'src-crates-spicer-2012',
    citation: 'Crates, N. & Spicer, N. (2012)',
    studyType: 'Non-controlled study, n=32',
    url: null,
    notes: 'Positive finding, no control group.',
  },
  {
    id: 'src-hassiotis-2009-pilot',
    citation: 'Hassiotis et al. (2009)',
    studyType: 'Pilot study, n=63',
    url: null,
    notes:
      'Pilot behind the widely-quoted 43% reduction figure. Superseded for effectiveness claims by the 2018 cluster RCT from the same group.',
  },
  {
    id: 'src-hassiotis-2018-rct',
    citation: 'Hassiotis et al. (2018)',
    studyType: 'Cluster randomised controlled trial, n=246',
    url: null,
    notes: 'Found no significant effect at follow-up. Never cite the 2009 pilot figure without this result alongside it.',
  },
  {
    id: 'src-paulauskaite-review',
    citation: 'Paulauskaite et al. — review-synthesis',
    studyType: 'Review-synthesis',
    url: null,
    notes: null,
  },
  {
    id: 'src-pbs-practice-general',
    citation: 'General positive behaviour support practice literature',
    studyType: 'Practice guide / expert consensus',
    url: null,
    notes: 'No single controlled-trial source identified in this seed extraction — evidence_tier reflects that honestly.',
  },
]

const now = new Date('2026-01-01T00:00:00.000Z').toISOString()

export const STRATEGIES: StrategyTemplate[] = [
  // --- §5 precedent case 1: Differential Reinforcement, merged into one
  // row with mixed_package_level evidence rather than two conflicting rows.
  {
    id: 'strat-differential-reinforcement',
    version: 1,
    technique_name: 'Differential Reinforcement of Alternative Behaviour (DRA)',
    description:
      'Reinforce a specific alternative behaviour that serves the same function as the behaviour of concern, while withholding reinforcement for the behaviour of concern itself.',
    strategy_category: ['learning'],
    is_responsive: false,
    population: ['Adults with intellectual disability'],
    evidence_tier: 'mixed_package_level',
    evidence_summary:
      'Crates & Spicer (2012, n=32, no control) reported a positive effect, but Hassiotis et al. (2018, cluster RCT, n=246) found no significant effect for the manualised package this technique sat within — both findings are held together here rather than in separate rows.',
    sourceIds: ['src-crates-spicer-2012', 'src-hassiotis-2018-rct'],
    prerequisites: 'A confirmed or strongly hypothesised behavioural function to select a matched alternative behaviour against.',
    capacity_considerations: ['cognitive'],
    capacity_considerations_note:
      'The alternative behaviour must be within the person\'s current motor/cognitive repertoire, or itself become a discrete teaching target before this can run as reinforcement-only.',
    contraindications: 'Not appropriate where no clear function has been established — reinforcing an "alternative" of unknown relationship to function risks reinforcing an unrelated behaviour.',
    measurement_guidance: 'Track rate of the alternative behaviour and rate of the behaviour of concern in parallel, not the alternative alone.',
    delivery_format: 'Ongoing, embedded in daily support — not a discrete session.',
    supersededBy: null,
    createdAt: now,
  },

  // --- §5 precedent case 2: the 43%-figure pilot, and the RCT that
  // supersedes it. Two separate rows on purpose (different studies of
  // different interventions/samples), linked via supersededBy.
  {
    id: 'strat-pbs-carer-training-pilot',
    version: 1,
    technique_name: 'Manualised PBS Carer Training Package (pilot evidence)',
    description:
      'A structured, manualised training package for paid carers, covering functional assessment and PBS planning for adults with intellectual disability and challenging behaviour.',
    strategy_category: ['environmental', 'learning'],
    is_responsive: false,
    population: ['Adults with intellectual disability', 'Paid carers/support staff'],
    evidence_tier: 'single_study',
    evidence_summary:
      'Attributed a 43% reduction in challenging behaviour in the original pilot (Hassiotis et al. 2009, n=63) — a promising but small, uncontrolled result. The same group\'s later, larger cluster RCT (see the superseding entry below) found no significant effect at follow-up.',
    sourceIds: ['src-hassiotis-2009-pilot', 'src-paulauskaite-review'],
    prerequisites: 'Paid carer availability for the full training package; organisational buy-in.',
    capacity_considerations: [],
    capacity_considerations_note: '',
    contraindications: 'None specific to the individual — this is a carer-training-level intervention.',
    measurement_guidance: 'Package-level outcome measure only in the source pilot — not decomposed to individual technique effect.',
    delivery_format: 'Multi-session carer training programme.',
    supersededBy: 'strat-pbs-carer-training-rct',
    createdAt: now,
  },
  {
    id: 'strat-pbs-carer-training-rct',
    version: 1,
    technique_name: 'Manualised PBS Carer Training Package (cluster RCT evidence)',
    description:
      'The same manualised carer training package as strat-pbs-carer-training-pilot, tested in a larger, controlled trial.',
    strategy_category: ['environmental', 'learning'],
    is_responsive: false,
    population: ['Adults with intellectual disability', 'Paid carers/support staff'],
    evidence_tier: 'rct',
    evidence_summary:
      'Hassiotis et al. (2018) cluster RCT, n=246, found no significant effect on challenging behaviour at follow-up — supersedes the pilot\'s 43% figure for any effectiveness claim.',
    sourceIds: ['src-hassiotis-2018-rct'],
    prerequisites: 'Paid carer availability for the full training package; organisational buy-in.',
    capacity_considerations: [],
    capacity_considerations_note: '',
    contraindications: 'None specific to the individual — this is a carer-training-level intervention.',
    measurement_guidance: 'Cluster-randomised, package-level outcome measure.',
    delivery_format: 'Multi-session carer training programme.',
    supersededBy: null,
    createdAt: now,
  },

  {
    id: 'strat-antecedent-restructuring',
    version: 1,
    technique_name: 'Antecedent / Environmental Restructuring',
    description:
      'Modify the physical environment, routine, or sensory load ahead of time to reduce the likelihood that known triggers occur.',
    strategy_category: ['environmental'],
    is_responsive: false,
    population: ['General — widely described across intellectual disability and autism PBS practice'],
    evidence_tier: 'practice_guide',
    evidence_summary:
      'Widely described as a core PBS strategy in practice guides; no controlled-trial source specific to this technique was identified in this seed extraction.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'A behaviour formulation identifying specific antecedents/triggers to target.',
    capacity_considerations: [],
    capacity_considerations_note: '',
    contraindications: 'Over-restructuring can reduce a person\'s exposure to necessary skill-building demands — balance against Learning goals.',
    measurement_guidance: 'Track frequency of the targeted antecedent alongside behaviour rate, not behaviour rate alone.',
    delivery_format: 'Ongoing, embedded in the environment/routine.',
    supersededBy: null,
    createdAt: now,
  },
  {
    id: 'strat-visual-schedule',
    version: 1,
    technique_name: 'Visual Schedule / Predictability Supports',
    description: 'Provide a visual representation of upcoming activities and transitions to increase predictability.',
    strategy_category: ['environmental', 'communication'],
    is_responsive: false,
    population: ['General — widely described across intellectual disability and autism PBS practice'],
    evidence_tier: 'practice_guide',
    evidence_summary:
      'Widely described in practice guides as reducing distress around transitions; no controlled-trial source specific to this technique was identified in this seed extraction.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'Some capacity to attend to and interpret visual material (symbols, photos, or text, matched to the individual).',
    capacity_considerations: ['cognitive', 'communication'],
    capacity_considerations_note:
      'Check the person can actually interpret the visual format chosen (symbols vs. photos vs. text) — a schedule in the wrong format adds noise rather than predictability.',
    contraindications: 'None specific, beyond format mismatch above.',
    measurement_guidance: 'Track behaviour at transition points specifically, before and after introduction.',
    delivery_format: 'Ongoing, embedded in daily routine.',
    supersededBy: null,
    createdAt: now,
  },
  {
    id: 'strat-functional-communication-training',
    version: 1,
    technique_name: 'Functional Communication Training (FCT)',
    description:
      'Explicitly teach a communicative response (word, sign, symbol exchange, device) that achieves the same outcome the behaviour of concern currently achieves.',
    strategy_category: ['communication', 'learning'],
    is_responsive: false,
    population: ['Individuals with an identified communicative function for the behaviour of concern'],
    evidence_tier: 'practice_guide',
    evidence_summary:
      'A long-established technique in the applied behaviour literature; this seed extraction did not include a specific controlled-trial source, so evidence_tier is set conservatively.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'A confirmed or strongly hypothesised communicative function.',
    capacity_considerations: ['communication', 'cognitive'],
    capacity_considerations_note:
      'The replacement response must be achievable within the person\'s current motor/communication repertoire — check this before selecting a modality (speech, sign, exchange, device).',
    contraindications: 'Not appropriate where no communicative function has been established.',
    measurement_guidance: 'Track rate of the new communicative response and rate of the behaviour of concern in parallel.',
    delivery_format: 'Structured teaching sessions plus embedded practice throughout the day.',
    supersededBy: null,
    createdAt: now,
  },
  {
    id: 'strat-choice-making',
    version: 1,
    technique_name: 'Choice-Making Opportunities',
    description: 'Build structured opportunities for the person to make genuine choices across the day (activity, order, pace).',
    strategy_category: ['environmental'],
    is_responsive: false,
    population: ['General — widely described across intellectual disability PBS practice'],
    evidence_tier: 'practice_guide',
    evidence_summary:
      'Widely described in practice guides as reducing escape-motivated behaviour; no controlled-trial source specific to this technique was identified in this seed extraction.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'At least two genuinely available options for the choice to be meaningful.',
    capacity_considerations: [],
    capacity_considerations_note: '',
    contraindications: 'None specific.',
    measurement_guidance: 'Track number of choice points offered per day alongside behaviour rate.',
    delivery_format: 'Ongoing, embedded in daily routine.',
    supersededBy: null,
    createdAt: now,
  },
  {
    id: 'strat-task-demand-modification',
    version: 1,
    technique_name: 'Task / Demand Modification',
    description: 'Adjust the difficulty, length, or pacing of a demand to bring it within the person\'s current tolerance while skills are built.',
    strategy_category: ['environmental', 'learning'],
    is_responsive: false,
    population: ['General — widely described across intellectual disability PBS practice'],
    evidence_tier: 'practice_guide',
    evidence_summary:
      'Widely described in practice guides for escape-motivated behaviour; no controlled-trial source specific to this technique was identified in this seed extraction.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'A confirmed or strongly hypothesised escape/avoidance function.',
    capacity_considerations: ['cognitive'],
    capacity_considerations_note: 'Modify demand level against the person\'s actual current skill level, not an assumed baseline.',
    contraindications: 'Over-modification can under-challenge and slow skill development — pair with a plan to fade support.',
    measurement_guidance: 'Track task completion and behaviour rate together, not completion alone.',
    delivery_format: 'Embedded in existing task/teaching sessions.',
    supersededBy: null,
    createdAt: now,
  },
  {
    id: 'strat-social-stories',
    version: 1,
    technique_name: 'Social Stories',
    description: 'A short, individualised narrative describing a situation, expected behaviour, and rationale, used to prepare a person for a specific context.',
    strategy_category: ['communication', 'learning'],
    is_responsive: false,
    population: ['Individuals who can engage with narrative/symbolic material, matched to level'],
    evidence_tier: 'expert_consensus',
    evidence_summary:
      'Commonly recommended in PBS and autism practice guidance; this seed extraction did not include a specific controlled-trial source.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'Some capacity to engage with narrative material at the person\'s comprehension level.',
    capacity_considerations: ['cognitive', 'communication'],
    capacity_considerations_note: 'Match story format and complexity to the person\'s actual comprehension level, not a generic template.',
    contraindications: 'None specific, beyond comprehension mismatch above.',
    measurement_guidance: 'Track behaviour in the targeted situation, before and after introduction.',
    delivery_format: 'Reviewed ahead of the targeted situation, not delivered in the moment.',
    supersededBy: null,
    createdAt: now,
  },
  {
    id: 'strat-paced-breathing',
    version: 1,
    technique_name: 'Paced Breathing / Physiological Calming',
    description: 'A structured slow-breathing technique used to support physiological regulation, practiced during calm periods and cued during early warning signs.',
    strategy_category: ['regulating', 'health_wellbeing'],
    is_responsive: false,
    population: ['Individuals able to voluntarily control breathing pattern'],
    evidence_tier: 'expert_consensus',
    evidence_summary:
      'Commonly recommended as a co-regulation/self-regulation technique in PBS and clinical practice guidance; this seed extraction did not include a specific controlled-trial source for this population.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'Practiced and rehearsed during calm periods before being relied on during early warning signs.',
    capacity_considerations: ['physical'],
    capacity_considerations_note:
      'This strategy assumes physical lung capacity and voluntary breath control — check for any respiratory condition or physical limitation before personalising it, even when every other box is checked.',
    contraindications: 'Respiratory conditions that make paced/slow breathing physically difficult or distressing.',
    measurement_guidance: 'Track uptake/use of the technique during early warning signs, and behaviour outcome relative to baseline.',
    delivery_format: 'Taught and rehearsed during calm periods; cued in the moment.',
    supersededBy: null,
    createdAt: now,
  },

  // --- Responsive strategies (§2: separate section, not mixed into the
  // proactive category filter; scaled against the escalation cycle).
  {
    id: 'strat-responsive-low-arousal',
    version: 1,
    technique_name: 'Low-Arousal Staff Response',
    description: 'Staff reduce their own tone, pace, volume, and physical presence in response to rising escalation, to avoid adding to arousal.',
    strategy_category: [],
    is_responsive: true,
    population: ['General — widely described across intellectual disability and crisis-prevention practice'],
    evidence_tier: 'expert_consensus',
    evidence_summary:
      'A general field convention in PBS and crisis-prevention training; this seed extraction did not include a specific controlled-trial source.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'Staff trained and rehearsed in the approach ahead of an actual incident.',
    capacity_considerations: [],
    capacity_considerations_note: '',
    contraindications: 'None specific to the individual — this is a staff-behaviour strategy.',
    measurement_guidance: 'Track escalation duration/peak intensity relative to baseline incidents.',
    delivery_format: 'Applied by staff during early warning through peak/crisis phases.',
    supersededBy: null,
    createdAt: now,
  },
  {
    id: 'strat-responsive-recovery-debrief',
    version: 1,
    technique_name: 'Recovery-Phase Co-Regulation and Debrief',
    description: 'During the recovery phase, staff offer quiet, low-demand presence and, once settled, a brief non-blaming debrief.',
    strategy_category: [],
    is_responsive: true,
    population: ['General — widely described across intellectual disability and crisis-prevention practice'],
    evidence_tier: 'expert_consensus',
    evidence_summary:
      'A general field convention in PBS and crisis-prevention training; this seed extraction did not include a specific controlled-trial source.',
    sourceIds: ['src-pbs-practice-general'],
    prerequisites: 'Applied only once the person has visibly moved into the recovery phase — not during peak/crisis.',
    capacity_considerations: [],
    capacity_considerations_note: '',
    contraindications: 'Debrief content and pacing must be matched to the person\'s current capacity, not rushed for staff convenience.',
    measurement_guidance: 'Track time-to-baseline in the recovery phase relative to prior incidents.',
    delivery_format: 'Applied by staff during the recovery phase only.',
    supersededBy: null,
    createdAt: now,
  },
]

export async function ensureSeeded(): Promise<void> {
  const count = await db.strategies.count()
  if (count > 0) return
  await db.transaction('rw', db.sources, db.strategies, async () => {
    await db.sources.bulkPut(SOURCES)
    await db.strategies.bulkPut(STRATEGIES)
  })
}
