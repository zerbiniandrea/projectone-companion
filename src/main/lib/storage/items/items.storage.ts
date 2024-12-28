import { Item, ItemToCatalyst, ItemToTierset } from '@shared/types/types'
import { db } from '../storage.config'
import { itemTable, itemToCatalystTable, itemToTiersetTable } from '../storage.schema'
import { conflictUpdateAllExcept } from '../storage.utils'

export const upsertItems = async (items: Item[]): Promise<void> => {
    await db
        .insert(itemTable)
        .values(items)
        .onConflictDoUpdate({
            target: itemTable.id,
            set: conflictUpdateAllExcept(itemTable, ['id'])
        })
}

export const upsertItemsToTierset = async (itemsToTierset: ItemToTierset[]): Promise<void> => {
    await db.delete(itemToTiersetTable)
    await db.insert(itemToTiersetTable).values(itemsToTierset)
}

export const upsertItemsToCatalyst = async (itemsToTierset: ItemToCatalyst[]): Promise<void> => {
    await db.delete(itemToCatalystTable)
    await db.insert(itemToCatalystTable).values(itemsToTierset)
}
