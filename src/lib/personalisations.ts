import { useLiveQuery } from 'dexie-react-hooks'
import { db, newId } from './db'
import type { EscalationPhase, PersonalisationRecord } from './types'

export function usePersonalisations(): PersonalisationRecord[] | undefined {
  return useLiveQuery(() => db.personalisations.orderBy('createdAt').reverse().toArray(), [])
}

export function usePersonalisation(id: string | undefined): PersonalisationRecord | null | undefined {
  return useLiveQuery(async () => {
    if (!id) return null
    return (await db.personalisations.get(id)) ?? null
  }, [id])
}

export interface CreatePersonalisationInput {
  strategyTemplateId: string
  strategyTemplateVersion: number
  participantIdentifyingDetails: string
  personalisedActivity: string
  rationale: string
  escalationPhase: EscalationPhase | null
  createdBy: string
}

// Version-pinned at creation time (brief §4/§6): the record always shows
// what the StrategyTemplate looked like when the practitioner personalised
// it, even if the template is later revised.
export async function createPersonalisation(input: CreatePersonalisationInput): Promise<string> {
  const id = newId()
  await db.personalisations.add({
    id,
    ...input,
    createdAt: new Date().toISOString(),
  })
  return id
}
