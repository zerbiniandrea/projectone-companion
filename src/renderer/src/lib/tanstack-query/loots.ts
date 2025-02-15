import {
    LootAssignmentInfo,
    LootWithItem,
    LootWithItemAndAssigned,
    NewLootManual
} from '@shared/types/types'

export const addLootsManual = async (
    raidSessionId: string,
    loots: NewLootManual[]
): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsManual(raidSessionId, loots)
}

export const addLootsFromRc = async (raidSessionId: string, csv: string): Promise<void> => {
    if (!raidSessionId) {
        throw new Error('No raid session id provided')
    }
    return await window.api.addLootsFromRc(raidSessionId, csv)
}

export const getLootsBySession = async (raidSessionId: string): Promise<LootWithItem[]> => {
    return await window.api.getLootsBySession(raidSessionId)
}

export const getLootsWithAssignedBySession = async (
    raidSessionId: string
): Promise<LootWithItemAndAssigned[]> => {
    return await window.api.getLootsWithAssignedBySession(raidSessionId)
}

export const getLootsBySessions = async (
    raidSessionIds: string[]
): Promise<LootWithItemAndAssigned[]> => {
    const lootsPromises = raidSessionIds.map((id) => getLootsWithAssignedBySession(id))
    const lootsArrays = await Promise.all(lootsPromises)
    return lootsArrays.flat()
}

export const assignLoot = async (charId: string, lootId: string, score?: number) => {
    return await window.api.assignLoot(charId, lootId, score)
}

export const getLootAssignmentInfo = async (lootId: string): Promise<LootAssignmentInfo> => {
    return await window.api.getLootAssignmentInfo(lootId)
}
