import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CAPACITY_CONSIDERATION_LABELS,
  EVIDENCE_TIER_LABELS,
  STRATEGY_CATEGORY_LABELS,
} from '../lib/types'
import { useSources, useStrategy, useSupersedingStrategy } from '../lib/strategies'

export function StrategyDetail() {
  const { strategyId } = useParams()
  const navigate = useNavigate()
  const strategy = useStrategy(strategyId)
  const superseding = useSupersedingStrategy(strategy?.supersededBy ?? null)
  const sources = useSources(strategy?.sourceIds ?? [])

  if (strategy === undefined) return <p className="text-sm text-slate-500">Loading…</p>
  if (strategy === null) return <p className="text-sm text-slate-500">Strategy not found.</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link to="/" className="text-sm text-slate-500 hover:underline">
          ← Back to strategies
        </Link>
        <h1 className="text-xl font-display font-bold text-[#111111] dark:text-white mt-1">
          {strategy.technique_name}
        </h1>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {strategy.strategy_category.map((c) => (
            <span
              key={c}
              className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs px-2 py-0.5"
            >
              {STRATEGY_CATEGORY_LABELS[c]}
            </span>
          ))}
          {strategy.is_responsive && (
            <span className="rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-200 text-xs px-2 py-0.5">
              Responsive
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-200">{strategy.description}</p>

      {/* §5 hard UI rule: a superseded strategy's headline figure must never
          render without the superseding result displayed alongside it. */}
      {strategy.supersededBy && (
        <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 p-3 text-sm text-red-900 dark:text-red-100 space-y-2">
          <p className="font-semibold">This entry has been superseded.</p>
          <p>{strategy.evidence_summary}</p>
          {superseding && (
            <p>
              Superseded by:{' '}
              <Link to={`/strategies/${superseding.id}`} className="underline font-medium">
                {superseding.technique_name}
              </Link>{' '}
              — {superseding.evidence_summary}
            </p>
          )}
        </div>
      )}

      {/* §3: capacity considerations render prominently, as a safety check,
          not buried with the rest of the metadata. */}
      {strategy.capacity_considerations.length > 0 && (
        <div className="rounded-md border-2 border-amber-400 bg-amber-50 dark:bg-amber-950 dark:border-amber-600 p-4 space-y-2">
          <p className="font-semibold text-amber-900 dark:text-amber-100">
            Check before personalising — capacity considerations
          </p>
          <div className="flex flex-wrap gap-1.5">
            {strategy.capacity_considerations.map((c) => (
              <span
                key={c}
                className="rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-50 text-xs font-semibold px-2 py-0.5"
              >
                {CAPACITY_CONSIDERATION_LABELS[c]}
              </span>
            ))}
          </div>
          {strategy.capacity_considerations_note && (
            <p className="text-sm text-amber-900 dark:text-amber-100">{strategy.capacity_considerations_note}</p>
          )}
        </div>
      )}

      <dl className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-3 text-sm">
        <dt className="font-semibold text-slate-500">Evidence tier</dt>
        <dd className="text-slate-700 dark:text-slate-200">{EVIDENCE_TIER_LABELS[strategy.evidence_tier]}</dd>

        <dt className="font-semibold text-slate-500">Evidence summary</dt>
        <dd className="text-slate-700 dark:text-slate-200">{strategy.evidence_summary}</dd>

        <dt className="font-semibold text-slate-500">Population studied</dt>
        <dd className="text-slate-700 dark:text-slate-200">{strategy.population.join('; ') || '—'}</dd>

        <dt className="font-semibold text-slate-500">Sources</dt>
        <dd className="text-slate-700 dark:text-slate-200">
          <ul className="list-disc pl-4 space-y-1">
            {(sources ?? []).filter(Boolean).map((src) => (
              <li key={src!.id}>
                {src!.citation} — {src!.studyType}
                {src!.notes ? <span className="block text-xs text-slate-500">{src!.notes}</span> : null}
              </li>
            ))}
          </ul>
        </dd>

        <dt className="font-semibold text-slate-500">Prerequisites</dt>
        <dd className="text-slate-700 dark:text-slate-200">{strategy.prerequisites || '—'}</dd>

        <dt className="font-semibold text-slate-500">Contraindications</dt>
        <dd className="text-slate-700 dark:text-slate-200">{strategy.contraindications || '—'}</dd>

        <dt className="font-semibold text-slate-500">Measurement guidance</dt>
        <dd className="text-slate-700 dark:text-slate-200">{strategy.measurement_guidance || '—'}</dd>

        <dt className="font-semibold text-slate-500">Delivery format</dt>
        <dd className="text-slate-700 dark:text-slate-200">{strategy.delivery_format || '—'}</dd>
      </dl>

      <button
        type="button"
        onClick={() => navigate(`/personalisations/new?strategyId=${strategy.id}`)}
        className="rounded-md bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-4 py-2 text-sm font-semibold"
      >
        Personalise this strategy
      </button>
    </div>
  )
}
