import { StrategyCard } from '../components/StrategyCard'
import { useResponsiveStrategies } from '../lib/strategies'

// Separate page, not a filter option on Strategies (brief §2): Responsive
// strategies are conceptually and structurally distinct from the six
// proactive categories — scaled against the escalation cycle and
// participant safety/capacity, not browsed the same way.
export function Responsive() {
  const strategies = useResponsiveStrategies()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-[#111111] dark:text-white">Responsive strategies</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Not proactive strategies — these are applied based on where the person is in the escalation cycle
          (baseline → early warning → escalation → peak/crisis → de-escalation → recovery), and on the person's
          safety and capacity at that moment, not uniformly.
        </p>
      </div>

      {strategies === undefined ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : strategies.length === 0 ? (
        <p className="text-sm text-slate-500">No responsive strategies in the library yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {strategies.map((s) => (
            <StrategyCard key={s.id} strategy={s} />
          ))}
        </div>
      )}
    </div>
  )
}
