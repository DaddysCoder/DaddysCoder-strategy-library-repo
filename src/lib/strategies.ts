import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { StrategyCategory, StrategyTemplate } from './types'

// Filtered in-memory rather than via an IndexedDB-indexed boolean query —
// the seed library is small (tens, not thousands, of entries) and boolean
// index behaviour is inconsistent across IndexedDB implementations.
export function useProactiveStrategies(categoryFilter: StrategyCategory[]): StrategyTemplate[] | undefined {
  return useLiveQuery(async () => {
    const all = await db.strategies.toArray()
    const proactive = all.filter((s) => !s.is_responsive)
    if (categoryFilter.length === 0) return proactive
    return proactive.filter((s) => s.strategy_category.some((c) => categoryFilter.includes(c)))
  }, [categoryFilter.join(',')])
}

export function useResponsiveStrategies(): StrategyTemplate[] | undefined {
  return useLiveQuery(async () => (await db.strategies.toArray()).filter((s) => s.is_responsive), [])
}

export function useStrategy(id: string | undefined): StrategyTemplate | null | undefined {
  return useLiveQuery(async () => {
    if (!id) return null
    return (await db.strategies.get(id)) ?? null
  }, [id])
}

export function useSupersedingStrategy(supersededBy: string | null): StrategyTemplate | null | undefined {
  return useLiveQuery(async () => {
    if (!supersededBy) return null
    return (await db.strategies.get(supersededBy)) ?? null
  }, [supersededBy])
}

export function useSources(ids: string[]) {
  return useLiveQuery(async () => db.sources.bulkGet(ids), [ids.join(',')])
}
