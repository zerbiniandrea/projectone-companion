import { CLASSES, RAID_DIFF, ROLES } from '@shared/consts/wow.consts'
import { relations } from 'drizzle-orm'
import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    unique,
    varchar
} from 'drizzle-orm/pg-core'

//////////////////////////////////////////////////////////
//                      ENUMS                           //
//////////////////////////////////////////////////////////

export const pgClassEnum = pgEnum('class', CLASSES)
export const pgRoleEnum = pgEnum('role', ROLES)
export const pgRaidDiffEnum = pgEnum('raid_diff', RAID_DIFF)

//////////////////////////////////////////////////////////
//                   CHARACHTERS                        //
//////////////////////////////////////////////////////////

export const playerTable = pgTable('players', {
    id: varchar('id').primaryKey(),
    name: varchar('name').notNull().unique()
})

export const charTable = pgTable('chars', {
    id: varchar('id').primaryKey(),
    name: varchar('name', { length: 24 }).notNull().unique(), // wow charname limit == 24
    class: pgClassEnum().notNull(),
    role: pgRoleEnum().notNull(),
    playerId: varchar('player_id')
        .references(() => playerTable.id)
        .notNull()
})

export const bisListTable = pgTable('bis_list', {
    id: varchar('id').primaryKey(),
    charId: varchar('char_id')
        .references(() => charTable.id)
        .notNull()
    //itemList: text('item_list').array() // array of strings
})

//////////////////////////////////////////////////////////
//                   SIMULATIONS                        //
//////////////////////////////////////////////////////////

export const droptimizerUpgradesTable = pgTable(
    'droptimizer_upgrades',
    {
        id: varchar('id').primaryKey(),
        dps: integer('dps').notNull(),
        slot: varchar('slot').notNull(),
        itemId: integer('item_id')
            .references(() => itemTable.id)
            .notNull(),
        catalyzedItemId: integer('catalyzed_item_id').references(() => itemTable.id),
        droptimizerId: varchar('droptimizer_id')
            .references(() => droptimizerTable.id)
            .notNull()
    },
    (t) => [
        unique('item_upgrade_in_droptimizer').on(t.itemId, t.droptimizerId) // un itemid per droptimizer
    ]
)

export const droptimizerTable = pgTable('droptimizers', {
    id: varchar('id').primaryKey(),
    url: text('url').notNull(),
    resultRaw: text('result_raw').notNull(),
    date: integer('date').notNull(),
    fightStyle: varchar('fight_style', { length: 50 }).notNull(),
    duration: integer('duration').notNull(),
    nTargets: integer('n_targets').notNull(),
    raidDifficulty: varchar('raid_difficulty', { length: 20 }).notNull(),
    characterName: varchar('character_name', { length: 24 }).notNull()
})

//////////////////////////////////////////////////////////
//                   RAID SESSION                       //
//////////////////////////////////////////////////////////

export const raidSessionTable = pgTable('raid_sessions', {
    id: varchar('id').primaryKey(),
    startedAt: integer('date').notNull(),
    completedAt: integer('date')
})

export const raidSessionRosterTable = pgTable(
    'raid_sessions_roster',
    {
        id: varchar('id').primaryKey(),
        raidSessionId: varchar('raid_session_id')
            .references(() => raidSessionTable.id)
            .notNull(),
        charId: varchar('char_id')
            .references(() => charTable.id)
            .notNull()
    },
    (t) => [
        unique('raid_partecipation').on(t.raidSessionId, t.charId) // un char può partecipare ad una sessione alla volta
    ]
)

export const lootTable = pgTable('loots', {
    id: varchar('id').primaryKey(),
    dropDate: integer('drop_date').notNull(),
    thirdStat: varchar('third_stat', { length: 255 }),
    socket: boolean('socket').notNull().default(false),
    // eligibility: text('eligibility').array(), // array of IDs referencing RaidSession.Chars
    raidSessionId: varchar('raid_session_id')
        .references(() => raidSessionTable.id)
        .notNull(),
    itemId: integer('item_id')
        .references(() => itemTable.id)
        .notNull(),
    bossId: integer('boss_id')
        .references(() => bossTable.id)
        .notNull() // ridondato per comodità ma ricavabile da item.boss.id
})

export const assignmentTable = pgTable('assignments', {
    id: varchar('id').primaryKey(),
    charId: varchar('char_id')
        .references(() => charTable.id)
        .notNull(),
    lootId: varchar('loot_id')
        .references(() => lootTable.id)
        .unique('loot_assignment')
        .notNull() // un loot può essere assegnato una sola volta
})

//////////////////////////////////////////////////////////
//                     JSON DATA                        //
//////////////////////////////////////////////////////////

export const bossTable = pgTable('bosses', {
    id: integer('id').primaryKey(), // // ricicliamo journal_encounter_id fornito da wow api
    name: varchar('name', { length: 255 }).notNull().unique(),
    raid: varchar('raid', { length: 255 }).notNull(),
    order: integer('order').notNull()
})

// Sono gli item lootabili dal raid - contiene l'import di public/items.csv
export const itemTable = pgTable('items', {
    id: integer('id').primaryKey(), // ricicliamo id fornito da wow api
    name: varchar('name', { length: 255 }).notNull(),
    ilvlMythic: integer('ilvl_mythic'),
    ilvlHeroic: integer('ilvl_heroic'),
    ilvlNormal: integer('ilvl_normal'),
    itemClass: varchar('item_class', { length: 50 }),
    slot: varchar('slot', { length: 50 }),
    itemSubclass: varchar('item_subclass', { length: 50 }),
    tierPrefix: varchar('tier_prefix', { length: 50 }), // es: Dreadful
    tier: boolean('tier').notNull().default(false), // se è un item tierser
    veryRare: boolean('very_rare').notNull().default(false),
    boe: boolean('boe').notNull().default(false),
    specs: text('specs').array(), // null == tutte le spec
    specIds: text('spec_ids').array(),
    classes: text('classes').array(),
    classesId: text('classes_id').array(),
    stats: text('stats'),
    mainStats: varchar('main_stats', { length: 50 }),
    secondaryStats: varchar('secondary_stats', { length: 50 }),
    wowheadUrl: text('wowhead_url'),
    iconName: varchar('icon_name', { length: 255 }),
    iconUrl: text('icon_url'),
    catalyzed: boolean('catalyzed').notNull().default(false), // se questo item è ottenibile solo tramite catalyst - todo: sul db viene messo sempre false.
    bossName: varchar('boss_name', { length: 255 }), // ridondante ma utile
    bossId: integer('boss_id')
        .references(() => bossTable.id)
        .notNull()
})

// Mapping tra itemId e Tier Token che lo genera - contiene l'import di public/items_to_tierset.csv
export const itemToTiersetTable = pgTable('items_to_tierset', {
    itemId: integer('item_id').primaryKey(),
    tokenId: integer('token_id')
        .references(() => itemTable.id)
        .notNull()
})

// Mapping tra itemId e relativi catalyst (preso da public/items_to_catalyst.json)
// La logica è: catalyzedItemId è l'item id ottenuto se dovessi catalizzare l'itemId.
// encounterId ci server per il reverse lookup: da catalyzedItemId + encounterId risalgo all'itemId originale
export const itemToCatalystTable = pgTable(
    'items_to_catalyst',
    {
        itemId: integer('item_id').notNull(),
        encounterId: integer('encounter_id').notNull(),
        catalyzedItemId: integer('catalyzed_item_id').notNull()
    },
    (t) => [
        {
            pk: primaryKey({ columns: [t.itemId, t.encounterId, t.catalyzedItemId] }) // todo: non va
        }
    ]
)

//////////////////////////////////////////////////////////
//                     RELATIONS                        //
//////////////////////////////////////////////////////////

export const playerCharRelations = relations(playerTable, ({ many }) => ({
    chars: many(charTable)
}))

export const charPlayerRelations = relations(charTable, ({ one }) => ({
    player: one(playerTable, {
        fields: [charTable.playerId],
        references: [playerTable.id]
    })
}))

export const droptimizerUpgradesRelations = relations(droptimizerUpgradesTable, ({ one }) => ({
    droptimizer: one(droptimizerTable, {
        fields: [droptimizerUpgradesTable.droptimizerId],
        references: [droptimizerTable.id]
    })
}))

export const droptimizerRelations = relations(droptimizerTable, ({ many }) => ({
    upgrades: many(droptimizerUpgradesTable)
}))
