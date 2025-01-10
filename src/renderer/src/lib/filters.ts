import type { Droptimizer } from '../../../../shared/types/types'
import { unixTimestampToRelativeDays } from './utils'

export type LootFilter = {
    raidDiff: string
    onlyLatest: boolean
    onlyUpgrades: boolean
    minUpgrade: number
    olderThanDays: boolean
    maxDays: number
}

export function filterDroptimizer(droptimizers: Droptimizer[], filter: LootFilter): Droptimizer[] {
    // Using a Map to track the latest droptimizer for each characterName
    const latestDroptimizersMap = new Map()

    const filterByDroptimizerFilters = droptimizers
        .sort((a, b) => b.simInfo.date - a.simInfo.date)
        .filter((dropt) => {
            // Filter by raid difficulty
            if (filter.raidDiff !== 'all' && dropt.raidInfo.difficulty !== filter.raidDiff) {
                return false
            }

            // Filter droptimizer older than X days
            if (
                filter.olderThanDays &&
                unixTimestampToRelativeDays(dropt.simInfo.date) > filter.maxDays
            ) {
                return false
            }

            // Works only if the droptimizer array is sorted by dropt.simInfo.date desc
            if (filter.onlyLatest) {
                const existingDropt = latestDroptimizersMap.get(dropt.ak)
                if (!existingDropt || dropt.simInfo.date > existingDropt.simInfo.date) {
                    latestDroptimizersMap.set(dropt.ak, dropt)
                } else {
                    return false
                }
            }
            return true
        })

    return filterByDroptimizerFilters
        .map((dropt) => {
            const upgrades = dropt.upgrades ?? []
            // Filter by upgrades
            const filteredUpgrades = upgrades.filter((upgrade) => {
                // Filter by upgrades
                if (filter.onlyUpgrades && upgrade.dps < filter.minUpgrade) {
                    return false
                }
                return true
            })
            return {
                ...dropt,
                upgrades: filteredUpgrades
            }
        })
        .filter((dropt) => dropt.upgrades && dropt.upgrades.length > 0)
}
