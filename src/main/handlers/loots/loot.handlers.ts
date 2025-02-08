import { LootWithItem, NewLootsFromManualInput, NewLootsFromRc } from '@shared/types/types'
import {
    addLoots,
    assignLoot,
    getLootsByRaidSessionId,
    unassignLoot
} from '@storage/loots/loots.storage'
import { getRaidSessionRoster } from '@storage/raid-session/raid-session.storage'
import { parseRaidSessionCsv } from './loot.utils'

export const addRaidLootsByRCLootCsvHandler = async (loot: NewLootsFromRc): Promise<void> => {
    const parsedData = await parseRaidSessionCsv(loot.csv)
    const elegibleCharacters = await getRaidSessionRoster(loot.raidSessionId)

    await addLoots(loot.raidSessionId, parsedData, elegibleCharacters)
}

export const addRaidLootsByManualInputHandler = async (
    loot: NewLootsFromManualInput
): Promise<void> => {
    //const parsedData = await parseRaidSessionCsv(loot.raidSessionId, loot.csv)
    console.log(loot)

    // TODO: insertion
}

export const getLootsBySessionIdHandler = async (
    raidSessionId: string
): Promise<LootWithItem[]> => {
    const res = await getLootsByRaidSessionId(raidSessionId)
    return res
}

export const assignLootHandler = async (
    charId: string,
    lootId: string,
    score?: number
): Promise<void> => {
    await assignLoot(charId, lootId, score)
}

export const unassignLootHandler = async (lootId: string): Promise<void> => {
    await unassignLoot(lootId)
}
