import { useState } from 'react'
import { StrategyCard } from '../components/StrategyCard'
import { useProactiveStrategies } from '../lib/strategies'
import { EVIDENCE_TIER_LABELS, STRATEGY_CATEGORY_LABELS } from '../lib/types'
import type { EvidenceTier, StrategyCategory } from '../lib/types'

const ALL_CATEGORIES = Object.keys(STRATEGY_CATEGORY_LABELS) as StrategyCategory[]
const ALL_TIERS = Object.keys(EVIDENCE_TIER_LABELS) as EvidenceTier[]

// Proactive strategy browsing only (brief §2/§6): the six categories are
// multi-select and filtered together here. Responsive strategies are
// deliberately a separate page/section, never mixed into this filter.
export function Strategies() {
  const [categoryFilter, setCategoryFilter] = useState<StrategyCategory[]>([])
  const [tierFilter, setTierFilter] = useState<EvidenceTier | 'all'>('all')
  const strategies = useProactiveStrategies(categoryFilter)

  function toggleCategory(c: StrategyCategory) {
    setCategoryFilter((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const visible = strategies?.filter((s) => tierFilter === 'all' || s.evidence_tier === tierFilter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[#111111] dark:text-white">Strategies</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Browse and select strategies to personalise. This library assembles evidence-based options — it never
          recommends one for a specific case.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
            Category (select any)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                aria-pressed={categoryFilter.includes(c)}
                className={`rounded-full text-xs px-3 py-1 font-medium border ${
                  categoryFilter.includes(c)
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                {STRATEGY_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
            Evidence tier
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as EvidenceTier | 'all')}
              className="block mt-1 rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 px-2 py-1 text-sm font-normal normal-case"
            >
              <option value="all">All</option>
              {ALL_TIERS.map((t) => (
                <option key={t} value={t}>
                  {EVIDENCE_TIER_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visible === undefined ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-slate-500">No strategies match the current filters.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((s) => (
            <StrategyCard key={s.id} strategy={s} />
          ))}
        </div>
      )}
    </div>
  )
}
