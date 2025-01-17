import { itemToCatalystArraySchema, itemToTiersetArraySchema } from '@shared/schemas/items.schema'
import type {
    Droptimizer,
    ItemToCatalyst,
    ItemToTierset,
    NewDroptimizer
} from '@shared/types/types'
import { db } from '@storage/storage.config'
import { droptimizerTable, droptimizerUpgradesTable } from '@storage/storage.schema'
import { takeFirstResult } from '@storage/storage.utils'
import { eq, InferInsertModel } from 'drizzle-orm'
import { newUUID } from '../../utils'
import { droptimizerListStorageSchema, droptimizerStorageSchema } from './droptimizer.schemas'

/**
 * Retrieves a Droptimizer by its ID from the database.
 *
 * @param droptimizerId - The unique identifier of the Droptimizer to retrieve.
 * @returns A Promise that resolves to the Droptimizer object if found, or null if not found.
 */
export const getDroptimizer = async (url: string): Promise<Droptimizer | null> => {
    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.url, url),
        with: {
            upgrades: true
        }
    })

    if (!result) {
        return null
    }

    return droptimizerStorageSchema.parse(result)
}

export const getItemToTiersetMapping = async (): Promise<ItemToTierset[]> => {
    const result = await db.query.itemToTiersetTable.findMany()
    return itemToTiersetArraySchema.parse(result)
}
export const getItemToCatalystMapping = async (): Promise<ItemToCatalyst[]> => {
    const result = await db.query.itemToCatalystTable.findMany()
    return itemToCatalystArraySchema.parse(result)
}

export const getDroptimizerList = async (): Promise<Droptimizer[]> => {
    const result = await db.query.droptimizerTable.findMany({
        with: {
            upgrades: {
                columns: {
                    catalyzedItemId: false, //ignored
                    itemId: false //ignored
                },
                with: {
                    item: true,
                    catalyzedItem: true
                }
            }
        }
    })

    return droptimizerListStorageSchema.parse(result)
}

export const addDroptimizer = async (droptimizer: NewDroptimizer): Promise<Droptimizer> => {
    const droptimizerId = await db.transaction(async (tx) => {
        // se è già stato importato, per ora sovrascrivo poi vedremo
        await tx.delete(droptimizerTable).where(eq(droptimizerTable.url, droptimizer.url))

        const droptimizerRes = await tx
            .insert(droptimizerTable)
            .values({
                url: droptimizer.url,
                ak: droptimizer.ak,
                dateImported: droptimizer.dateImported,
                simDate: droptimizer.simInfo.date,
                simFightStyle: droptimizer.simInfo.fightstyle,
                simDuration: droptimizer.simInfo.duration,
                simNTargets: droptimizer.simInfo.nTargets,
                simRaidbotInput: droptimizer.simInfo.raidbotInput,
                raidId: droptimizer.raidInfo.id,
                raidDifficulty: droptimizer.raidInfo.difficulty,
                characterName: droptimizer.charInfo.name,
                characterServer: droptimizer.charInfo.server,
                characterClass: droptimizer.charInfo.class,
                characterClassId: droptimizer.charInfo.classId,
                characterSpec: droptimizer.charInfo.spec,
                characterSpecId: droptimizer.charInfo.specId,
                characterTalents: droptimizer.charInfo.talents
            })
            .returning({ url: droptimizerTable.url })
            .then(takeFirstResult)

        if (!droptimizerRes) {
            tx.rollback()
            const errorMsg = `Failed to insert droptimizer. Droptimizer: ${JSON.stringify(droptimizer)}`
            console.log(errorMsg)
            throw new Error(errorMsg)
        }

        const upgradesArray = droptimizer.upgrades.map(
            (up): InferInsertModel<typeof droptimizerUpgradesTable> => ({
                id: newUUID(),
                droptimizerId: droptimizerRes.url,
                ...up
            })
        )

        await tx.insert(droptimizerUpgradesTable).values(upgradesArray)

        return droptimizerRes.url
    })

    const result = await db.query.droptimizerTable.findFirst({
        where: (droptimizerTable, { eq }) => eq(droptimizerTable.url, droptimizerId),
        with: {
            upgrades: {
                columns: {
                    catalyzedItemId: false, //ignored
                    itemId: false //ignored
                },
                with: {
                    item: true,
                    catalyzedItem: true
                }
            }
        }
    })

    return droptimizerStorageSchema.parse(result)
}

export const deleteDroptimizer = async (url: string): Promise<void> => {
    // droptimizerUpgradesTable will be deleted on "cascade"
    await db.delete(droptimizerTable).where(eq(droptimizerTable.url, url))
}
