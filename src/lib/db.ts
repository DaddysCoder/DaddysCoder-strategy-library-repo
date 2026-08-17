import Dexie, { type EntityTable } from 'dexie'
import type { Practitioner, PersonalisationRecord, StrategySource, StrategyTemplate } from './types'

class StrategyLibraryDatabase extends Dexie {
  practitioners!: EntityTable<Practitioner, 'id'>
  strategies!: EntityTable<StrategyTemplate, 'id'>
  sources!: EntityTable<StrategySource, 'id'>
  personalisations!: EntityTable<PersonalisationRecord, 'id'>

  constructor() {
    super('strategy-library')
    this.version(1).stores({
      practitioners: 'id',
      strategies: 'id, is_responsive, evidence_tier, supersededBy, *strategy_category',
      sources: 'id',
      personalisations: 'id, strategyTemplateId, participantIdentifyingDetails, createdAt',
    })
  }
}

export const db = new StrategyLibraryDatabase()

export function newId(): string {
  return crypto.randomUUID()
}
