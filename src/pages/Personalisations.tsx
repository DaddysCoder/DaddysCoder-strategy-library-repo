import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import { usePersonalisations } from '../lib/personalisations'
import { usePractitioner } from '../lib/practitioner'
import { renderPlanReadyExport } from '../lib/documentExport'
import { ESCALATION_PHASE_LABELS } from '../lib/types'
import type { StrategyTemplate } from '../lib/types'

function openExport(html: string) {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function Personalisations() {
  const personalisations = usePersonalisations()
  const strategies = useLiveQuery(() => db.strategies.toArray(), [])
  const practitioner = usePractitioner()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const strategyById = new Map<string, StrategyTemplate>((strategies ?? []).map((s) => [s.id, s]))

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleExport() {
    if (!personalisations || selected.size === 0) return
    const entries = personalisations
      .filter((p) => selected.has(p.id))
      .map((p) => ({ personalisation: p, strategy: strategyById.get(p.strategyTemplateId) }))
      .filter((e): e is { personalisation: (typeof personalisations)[number]; strategy: StrategyTemplate } => !!e.strategy)
    if (entries.length === 0) return
    const html = renderPlanReadyExport(entries, practitioner?.name || 'Unknown practitioner', new Date().toISOString())
    openExport(html)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-[#111111] dark:text-white">Personalisations</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Select entries and export to a plan-ready document. Export assembles what you've already written — it
            doesn't generate new content.
          </p>
        </div>
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={handleExport}
          className="shrink-0 rounded-md bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-4 py-2 text-sm font-semibold disabled:opacity-40"
        >
          Export selected ({selected.size})
        </button>
      </div>

      {personalisations === undefined ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : personalisations.length === 0 ? (
        <p className="text-sm text-slate-500">No personalisations yet. Select a strategy to personalise it.</p>
      ) : (
        <ul className="space-y-3">
          {personalisations.map((p) => {
            const strategy = strategyById.get(p.strategyTemplateId)
            return (
              <li
                key={p.id}
                id={p.id}
                className="rounded-lg border border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-[#111111] dark:text-white">
                      {strategy?.technique_name ?? 'Unknown strategy'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Participant: {p.participantIdentifyingDetails}
                      {p.escalationPhase ? ` — ${ESCALATION_PHASE_LABELS[p.escalationPhase]}` : ''}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      <strong>Activity:</strong> {p.personalisedActivity}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      <strong>Rationale:</strong> {p.rationale}
                    </p>
                    <p className="text-xs text-slate-500">
                      {p.createdBy} · {new Date(p.createdAt).toLocaleString()}
                    </p>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
