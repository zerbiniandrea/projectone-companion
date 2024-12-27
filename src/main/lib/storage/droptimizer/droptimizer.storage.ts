import { Droptimizer, NewDroptimizer } from '../../../../../shared/types/types'
import { newUUID } from '../../utils'
import { db } from '../storage.config'
import { droptimizerTable, droptimizerUpgradesTable } from '../storage.schema'
import { takeFirstResult } from '../storage.utils'
import { droptimizerModelSchema } from './droptimizer.schemas'
import { UpgradesTableInsert } from './droptimizer.types'

export const getDroptimizer = async (droptimizerId: string): Promise<Droptimizer | null> => {
    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.id, droptimizerId),
        with: {
            upgrades: true
        }
    })

    if (!result) {
        return null
    }

    return droptimizerModelSchema.parse(result)
}

export const addDroptimizer = async (droptimizer: NewDroptimizer): Promise<Droptimizer> => {
    const itemsToTiersetMapping = await db.query.itemToTiersetTable.findMany() // fare la lookup una volta e memorizzare tutto

    const droptimizerId = await db.transaction(async (tx) => {
        const droptimizerRes = await tx
            .insert(droptimizerTable)
            .values({
                id: newUUID(),
                url: droptimizer.url,
                resultRaw: droptimizer.resultRaw,
                date: droptimizer.date,
                raidDifficulty: droptimizer.raidDifficulty,
                fightStyle: droptimizer.fightInfo.fightstyle,
                duration: droptimizer.fightInfo.duration,
                nTargets: droptimizer.fightInfo.nTargets,
                characterName: droptimizer.characterName
            })
            .returning({ id: droptimizerTable.id })
            .then(takeFirstResult)

        if (!droptimizerRes) {
            tx.rollback()
            const errorMsg = `Failed to insert droptimizer. Droptimizer: ${JSON.stringify(droptimizer)}`
            console.log(errorMsg)
            throw new Error(errorMsg)
        }

        const upgradesArray: UpgradesTableInsert[] = droptimizer.upgrades.map((up) => {
            const itemMapping = itemsToTiersetMapping.find((i) => i.itemId === up.itemId)
            return {
                id: newUUID(),
                droptimizerId: droptimizerRes.id,
                itemId: itemMapping ? itemMapping.tokenId : up.itemId,
                dps: up.dps
            }
        })

        await tx.insert(droptimizerUpgradesTable).values(upgradesArray).execute()

        return droptimizerRes.id
    })

    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.id, droptimizerId),
        with: {
            upgrades: true
        }
    })

    return droptimizerModelSchema.parse(result)
}
