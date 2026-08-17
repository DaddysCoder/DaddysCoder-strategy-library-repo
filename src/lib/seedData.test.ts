import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { ensureSeeded, SOURCES, STRATEGIES } from './seedData'

describe('seed data', () => {
  beforeEach(async () => {
    await db.strategies.clear()
    await db.sources.clear()
  })

  it('every strategy source id resolves to a seeded StrategySource', () => {
    const sourceIds = new Set(SOURCES.map((s) => s.id))
    for (const strategy of STRATEGIES) {
      for (const id of strategy.sourceIds) {
        expect(sourceIds.has(id), `${strategy.id} references missing source ${id}`).toBe(true)
      }
    }
  })

  it('every supersededBy id resolves to a seeded StrategyTemplate', () => {
    const strategyIds = new Set(STRATEGIES.map((s) => s.id))
    for (const strategy of STRATEGIES) {
      if (strategy.supersededBy) {
        expect(strategyIds.has(strategy.supersededBy), `${strategy.id} supersededBy missing target`).toBe(true)
      }
    }
  })

  // §5: never a bare positive figure with no contradicting result beside it.
  it('the superseded 43%-figure entry states the null RCT result in its own evidence_summary', () => {
    const pilot = STRATEGIES.find((s) => s.id === 'strat-pbs-carer-training-pilot')!
    expect(pilot.evidence_summary).toMatch(/43%/)
    expect(pilot.evidence_summary.toLowerCase()).toContain('no significant effect')
    expect(pilot.supersededBy).toBe('strat-pbs-carer-training-rct')
  })

  // §5: Differential Reinforcement must be one row, not two conflicting rows.
  it('differential reinforcement is a single merged entry with mixed_package_level evidence', () => {
    const drEntries = STRATEGIES.filter((s) => s.technique_name.toLowerCase().includes('differential reinforcement'))
    expect(drEntries).toHaveLength(1)
    expect(drEntries[0].evidence_tier).toBe('mixed_package_level')
    expect(drEntries[0].evidence_summary).toMatch(/32/)
    expect(drEntries[0].evidence_summary).toMatch(/246/)
  })

  // §2: strategy_category is never used to encode a function/responsive
  // classification — is_responsive is a separate boolean, and responsive
  // entries carry no proactive category.
  it('responsive strategies carry an empty strategy_category array', () => {
    for (const strategy of STRATEGIES) {
      if (strategy.is_responsive) {
        expect(strategy.strategy_category).toEqual([])
      } else {
        expect(strategy.strategy_category.length).toBeGreaterThan(0)
      }
    }
  })

  it('ensureSeeded populates the database exactly once', async () => {
    await ensureSeeded()
    const firstCount = await db.strategies.count()
    expect(firstCount).toBe(STRATEGIES.length)

    await ensureSeeded()
    const secondCount = await db.strategies.count()
    expect(secondCount).toBe(firstCount)
  })
})
