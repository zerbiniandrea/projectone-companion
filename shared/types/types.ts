import { bisListSchema } from '@shared/schemas/bis-list.schemas'
import { bossSchema, bossWithItemsSchema } from '@shared/schemas/boss.schema'
import {
    gearItemSchema,
    itemSchema,
    itemToCatalystSchema,
    itemToTiersetSchema,
    itemTrackSchema
} from '@shared/schemas/items.schema'
import {
    lootSchema,
    lootWithAssignedSchema,
    lootWithItemSchema,
    newLootManualSchema,
    newLootSchema
} from '@shared/schemas/loot.schema'
import {
    editRaidSessionSchema,
    newRaidSessionSchema,
    raidSessionSchema
} from '@shared/schemas/raid.schemas'
import { appSettingsSchema } from '@shared/schemas/store.schemas'
import { z } from 'zod'
import {
    characterGameInfoSchema,
    characterSchema,
    characterWithPlayerSchema,
    charWowAuditSchema,
    editCharacterSchema,
    editPlayerSchema,
    newCharacterSchema,
    newPlayerSchema,
    playerSchema,
    playerWithCharacterSchema
} from '../schemas/characters.schemas'
import {
    droptimizerCurrenciesSchema,
    droptimizerSchema,
    droptimizerUpgradeSchema,
    newDroptimizerSchema,
    newDroptimizerUpgradeSchema,
    raidbotsURLSchema
} from '../schemas/simulations.schemas'
import {
    wowArmorTypeSchema,
    wowClassNameSchema,
    wowItemEquippedSlotKeySchema,
    wowItemSlotKeySchema,
    wowItemSlotSchema,
    wowRaidDiffSchema,
    wowRolesSchema,
    wowSpecNameSchema,
    wowTiersetSlotSchema
} from '../schemas/wow.schemas'

export type WowClassName = z.infer<typeof wowClassNameSchema>
export type WowSpecName = z.infer<typeof wowSpecNameSchema>
export type WowSpec = {
    id: number
    name: WowSpecName
}

export type WowClass = {
    id: number
    name: WowClassName
    specs: WowSpec[]
}

export type WowRaidDifficulty = z.infer<typeof wowRaidDiffSchema>
export type WowItemSlot = z.infer<typeof wowItemSlotSchema>
export type WowItemSlotKey = z.infer<typeof wowItemSlotKeySchema>
export type WowItemEquippedSlotKey = z.infer<typeof wowItemEquippedSlotKeySchema>
export type WowArmorType = z.infer<typeof wowArmorTypeSchema>
export type WoWRole = z.infer<typeof wowRolesSchema>
export type WowTiersetSlot = z.infer<typeof wowTiersetSlotSchema>

export type Player = z.infer<typeof playerSchema>
export type PlayerWithCharacters = z.infer<typeof playerWithCharacterSchema>
export type NewPlayer = z.infer<typeof newPlayerSchema>
export type EditPlayer = z.infer<typeof editPlayerSchema>

export type Character = z.infer<typeof characterSchema>
export type CharacterGameInfo = z.infer<typeof characterGameInfoSchema>
export type CharacterWithPlayer = z.infer<typeof characterWithPlayerSchema>
export type NewCharacter = z.infer<typeof newCharacterSchema>
export type EditCharacter = z.infer<typeof editCharacterSchema>

export type CharacterWowAudit = z.infer<typeof charWowAuditSchema>

export type Droptimizer = z.infer<typeof droptimizerSchema>
export type DroptimizerUpgrade = z.infer<typeof droptimizerUpgradeSchema>
export type DroptimizerCurrenciesUpgrade = z.infer<typeof droptimizerCurrenciesSchema>

export type NewDroptimizer = z.infer<typeof newDroptimizerSchema>
export type NewDroptimizerUpgrade = z.infer<typeof newDroptimizerUpgradeSchema>
export type RaidbotsURL = z.infer<typeof raidbotsURLSchema>

export type Item = z.infer<typeof itemSchema>
export type ItemTrack = z.infer<typeof itemTrackSchema>
export type GearItem = z.infer<typeof gearItemSchema>

export type ItemToTierset = z.infer<typeof itemToTiersetSchema>
export type ItemToCatalyst = z.infer<typeof itemToCatalystSchema>

// bis list
export type BisList = z.infer<typeof bisListSchema>

// encounter
export type Boss = z.infer<typeof bossSchema>
export type BossWithItems = z.infer<typeof bossWithItemsSchema>

export type RaidSession = z.infer<typeof raidSessionSchema>
export type NewRaidSession = z.infer<typeof newRaidSessionSchema>
export type EditRaidSession = z.infer<typeof editRaidSessionSchema>

// Raid loots
export type Loot = z.infer<typeof lootSchema>
export type LootWithItem = z.infer<typeof lootWithItemSchema>
export type LootWithAssigned = z.infer<typeof lootWithAssignedSchema>
export type NewLoot = z.infer<typeof newLootSchema>
export type NewLootManual = z.infer<typeof newLootManualSchema>
export type TierSetCompletion = { type: 'none' } | { type: '2p' } | { type: '4p' }
export type CharAssignmentHighlights = {
    isMain: boolean
    dpsGain: number
    tierSetCompletion: TierSetCompletion
    ilvlDiff: number
    gearIsBis: boolean
    score: number
    isTrackUpgrade: boolean
}
export type CharAssignmentInfo = {
    character: Character
    droptimizers: {
        upgrade: DroptimizerUpgrade | null // dps gain info
        itemEquipped: GearItem // item that is going to be replaced by the upgrade
        droptimizer: Droptimizer // droptimizer source
    }[]
    weeklyChest: GearItem[]
    tierset: GearItem[]
    bestItemInSlot: GearItem[]
    bis: BisList[]
    highlights: CharAssignmentHighlights
}
export type LootAssignmentInfo = {
    loot: Loot
    eligible: CharAssignmentInfo[]
}

// App config
export type AppSettings = z.infer<typeof appSettingsSchema>
