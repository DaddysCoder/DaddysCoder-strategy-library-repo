import { Link } from 'react-router-dom'
import { EVIDENCE_TIER_LABELS, STRATEGY_CATEGORY_LABELS } from '../lib/types'
import type { StrategyTemplate } from '../lib/types'

export function StrategyCard({ strategy }: { strategy: StrategyTemplate }) {
  return (
    <Link
      to={`/strategies/${strategy.id}`}
      className="block rounded-lg border border-[#E5E5E5] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-[#111111] dark:hover:border-white transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-bold text-[#111111] dark:text-white">{strategy.technique_name}</h3>
        {strategy.supersededBy && (
          <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-semibold px-2 py-0.5">
            Superseded
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{strategy.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {strategy.strategy_category.map((c) => (
          <span
            key={c}
            className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs px-2 py-0.5"
          >
            {STRATEGY_CATEGORY_LABELS[c]}
          </span>
        ))}
        <span className="rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 text-xs px-2 py-0.5">
          {EVIDENCE_TIER_LABELS[strategy.evidence_tier]}
        </span>
      </div>
    </Link>
  )
}
