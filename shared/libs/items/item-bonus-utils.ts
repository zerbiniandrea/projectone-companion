/// sources: https://www.raidbots.com/static/data/live/bonuses.json
// parse tww item tracks:
// jq 'map(select(.upgrade.fullName != null and (.upgrade.seasonId == 24 or .upgrade.seasonId == 25)) | {id, level: .upgrade.level, max: .upgrade.max, name: .upgrade.name, fullName: .upgrade.fullName, itemLevel: .upgrade.itemLevel})' bonus.json > parsed_bonus.json

import { GearItem, Item, ItemTrack, WowItemTrackName, WowRaidDifficulty } from '@shared/types/types'
import bonusItemTracks, { queryByItemLevelAndName, trackNameToNumber } from './item-tracks'

function parseItemTrackName(
    bonusIds: number[],
    isToken: boolean,
    isTierset: boolean
): WowItemTrackName | null {
    const itemTrack = parseItemTrack(bonusIds)

    if (itemTrack) return itemTrack.name
    if (!itemTrack && bonusIds.length == 0) return null

    if (bonusIds.includes(10356)) {
        // bonus id for Mythic
        return 'Myth'
    } else if (bonusIds.includes(10355)) {
        // bonus id for Heroic
        return 'Hero'
    } else if (bonusIds.includes(10353)) {
        // bonus id for lfr
        return 'Veteran'
    }

    if (isToken || isTierset) {
        // if i am here and its a tierset/token -> Champion track becouse it doesnt have diff bonus ids
        return 'Champion'
    }

    //all other items -> no info
    return null
}

/**
 * Compara gear item a and b
 * @param a First Gear to compare
 * @param b Second Gear to compare
 * @returns 1 if a is an upgrade over b, -1 b otherwise, 0 if are the same
 */
export function compareGearItem(a: GearItem, b: GearItem): number {
    const delta = a.itemLevel - b.itemLevel

    if (a.item.season != b.item.season) {
        // a is item from new season
        return a.item.season > b.item.season ? 1 : -1
    }

    if (a.itemTrack && b.itemTrack) {
        // Compare max theoretical item level
        return Math.sign(a.itemTrack.maxItemLevel - b.itemTrack.maxItemLevel)
    }

    if ((a.item.token || b.item.token) && Math.abs(delta) <= 9) {
        // Token doesn't have item track
        // If difference is above 9, we use item level difference directly
        const aDiff = trackNameToNumber(
            parseItemTrackName(a.bonusIds ?? [], a.item.token, a.item.tierset)
        )
        const bDiff = trackNameToNumber(
            parseItemTrackName(b.bonusIds ?? [], b.item.token, b.item.tierset)
        )

        // The item with a track wins over one without a track
        if (aDiff && !bDiff) return 1
        if (!aDiff && bDiff) return -1

        return Math.sign(aDiff - bDiff)
    }

    return Math.sign(delta)
}

export function parseItemLevelFromBonusIds(item: Item, bonusIds: number[]): number | null {
    const diff = parseItemTrackName(bonusIds, item.token, item.tierset)

    if (diff != null) {
        switch (diff) {
            case 'Veteran':
                return item.ilvlBase + 22
            case 'Champion':
                return item.ilvlNormal
            case 'Hero':
                return item.ilvlHeroic
            case 'Myth':
                return item.ilvlMythic
            default:
                throw Error('parseItemLevelFromBonusIds: ' + diff + ' not mapped')
        }
    }

    // crafted items ilvl
    if (bonusIds.includes(11144)) {
        // tww season 1 rank 5
        return 636
    }

    // edge case items (not worth mapping all possible states with bonus id)
    if (item.id === 228411) {
        // tww season 1 -  Cyrce's Circlet (Siren Isles)
        return 658
    }

    return null
}

export function parseItemLevelFromRaidDiff(item: Item, raidDiff: WowRaidDifficulty): number {
    switch (raidDiff) {
        case 'LFR':
            return item.ilvlBase + 22
        case 'Normal':
            return item.ilvlNormal
        case 'Heroic':
            return item.ilvlHeroic
        case 'Mythic':
            return item.ilvlMythic
        default:
            throw new Error('parseItemLevelFromRaidLoot: unable to map raid diff')
    }
}

export function parseItemTrack(input: number[]): ItemTrack | null {
    for (const bonus of input) {
        if (bonus in bonusItemTracks) {
            return {
                level: bonusItemTracks[bonus].level,
                max: bonusItemTracks[bonus].max,
                name: bonusItemTracks[bonus].name,
                fullName: bonusItemTracks[bonus].fullName,
                itemLevel: bonusItemTracks[bonus].itemLevel,
                maxItemLevel: bonusItemTracks[bonus].maxItemLevel,
                season: bonusItemTracks[bonus].season
            }
        }
    }

    return null // Return null if no match is found
}

export const gearHasAvoidance = (input: number[] | null): boolean =>
    input ? input.includes(40) : false

export const gearHasLeech = (input: number[] | null): boolean =>
    input ? input.includes(41) : false

export const gearHasSpeed = (input: number[] | null): boolean =>
    input ? input.includes(42) : false

// 10397 Primastic Socket
// 11307 Socket on Crafted Gear
export const gearhasSocket = (input: number[] | null): boolean =>
    input ? [10397, 11307].some((value) => input.includes(value)) : false

export const gearTertiary = (input: number[] | null): boolean =>
    gearHasAvoidance(input) || gearHasLeech(input) || gearHasSpeed(input)

export function getItemTrack(ilvl: number, diff: WowRaidDifficulty): ItemTrack | null {
    let diffName

    switch (diff) {
        case 'Normal':
            diffName = 'Champion'
            break
        case 'Heroic':
            diffName = 'Hero'
            break
        case 'Mythic':
            diffName = 'Myth'
            break
        default:
            throw new Error('getItemTrack: diff not mapped')
    }

    return queryByItemLevelAndName(ilvl, diffName)
}

// gear manipolation
export function applyTokenDiff(input: number[], diff: WowRaidDifficulty): void {
    switch (diff) {
        case 'Heroic':
            input.push(10355)
            break
        case 'Mythic':
            input.push(10356)
            break
    }
}

export function applySocket(input: number[]): void {
    input.push(10397)
}
export function applyAvoidance(input: number[]): void {
    input.push(40)
}
export function applyLeech(input: number[]): void {
    input.push(41)
}
export function applySpeed(input: number[]): void {
    input.push(42)
}
