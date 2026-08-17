import { type FormEvent, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CAPACITY_CONSIDERATION_LABELS, ESCALATION_PHASE_LABELS } from '../lib/types'
import type { EscalationPhase } from '../lib/types'
import { useStrategy } from '../lib/strategies'
import { createPersonalisation } from '../lib/personalisations'
import { usePractitioner } from '../lib/practitioner'

const ALL_PHASES = Object.keys(ESCALATION_PHASE_LABELS) as EscalationPhase[]

// Free text only, no auto-suggestion (brief §1/§4/§6 — "assembles, doesn't
// generate"). The practitioner authors the personalised activity and
// rationale themselves; nothing here proposes wording for either field.
export function NewPersonalisation() {
  const [params] = useSearchParams()
  const strategyId = params.get('strategyId') ?? undefined
  const strategy = useStrategy(strategyId)
  const practitioner = usePractitioner()
  const navigate = useNavigate()

  const [participantIdentifyingDetails, setParticipantIdentifyingDetails] = useState('')
  const [personalisedActivity, setPersonalisedActivity] = useState('')
  const [rationale, setRationale] = useState('')
  const [escalationPhase, setEscalationPhase] = useState<EscalationPhase | ''>('')

  if (strategy === undefined) return <p className="text-sm text-slate-500">Loading…</p>
  if (strategy === null) return <p className="text-sm text-slate-500">Strategy not found.</p>

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!strategy) return
    const id = await createPersonalisation({
      strategyTemplateId: strategy.id,
      strategyTemplateVersion: strategy.version,
      participantIdentifyingDetails: participantIdentifyingDetails.trim(),
      personalisedActivity: personalisedActivity.trim(),
      rationale: rationale.trim(),
      escalationPhase: strategy.is_responsive && escalationPhase ? escalationPhase : null,
      createdBy: practitioner?.name || 'Unknown practitioner',
    })
    navigate(`/personalisations#${id}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[#111111] dark:text-white">Personalise a strategy</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{strategy.technique_name}</p>
      </div>

      {strategy.capacity_considerations.length > 0 && (
        <div className="rounded-md border-2 border-amber-400 bg-amber-50 dark:bg-amber-950 dark:border-amber-600 p-4 space-y-1">
          <p className="font-semibold text-amber-900 dark:text-amber-100">
            Check before personalising: {strategy.capacity_considerations.map((c) => CAPACITY_CONSIDERATION_LABELS[c]).join(', ')}
          </p>
          <p className="text-sm text-amber-900 dark:text-amber-100">{strategy.capacity_considerations_note}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Participant (identifying details)
          <input
            required
            value={participantIdentifyingDetails}
            onChange={(e) => setParticipantIdentifyingDetails(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-3 py-2 text-sm"
            placeholder="Kept locally, never joined into exports beyond this record"
          />
        </label>

        {strategy.is_responsive && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Escalation cycle phase this applies to
            <select
              value={escalationPhase}
              onChange={(e) => setEscalationPhase(e.target.value as EscalationPhase | '')}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-3 py-2 text-sm"
            >
              <option value="">— Select —</option>
              {ALL_PHASES.map((p) => (
                <option key={p} value={p}>
                  {ESCALATION_PHASE_LABELS[p]}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Personalised activity
          <textarea
            required
            rows={4}
            value={personalisedActivity}
            onChange={(e) => setPersonalisedActivity(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-3 py-2 text-sm"
            placeholder="Describe exactly how this strategy will be delivered for this person, in your own words"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Rationale
          <textarea
            required
            rows={4}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-3 py-2 text-sm"
            placeholder="Why this strategy, and why personalised this way, for this person"
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-4 py-2 text-sm font-semibold"
        >
          Save personalisation
        </button>
      </form>
    </div>
  )
}
