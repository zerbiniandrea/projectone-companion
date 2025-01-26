import { getBossesHandler, getRaidLootTableHandler } from './bosses/bosses.handlers'
import {
    addCharacterHandler,
    addPlayerHandler,
    deleteCharacterHandler,
    deletePlayerHandler,
    editCharacterHandler,
    editPlayerHandler,
    getCharacterHandler,
    getChracterListHandler,
    getPlayerWithCharactersListHandler,
    syncCharacterWowAudit
} from './characters/characters.handlers'
import {
    addDroptimizerHandler,
    deleteDroptimizerHandler,
    getDroptimizerLastByCharAndDiffHandler,
    getDroptimizerListHandler,
    syncDroptimizersFromDiscord
} from './droptimizer/droptimizer.handlers'
import { getItemsHandler, searchItemsHandler } from './items/items.handlers'
import {
    addRaidLootsByManualInputHandler,
    addRaidLootsByRCLootCsvHandler,
    getLootsBySessionIdHandler
} from './loots/loot.handlers'
import {
    addRaidSessionHandler,
    deleteRaidSessionHandler,
    editRaidSessionHandler,
    getRaidSessionHandler,
    getRaidSessionListHandler
} from './raid-session/raid-session.handlers'
import {
    getAppSettingsHandler,
    resetAppSettingsHandler,
    setAppSettingsHandler,
    upsertJsonDataHandler
} from './settings/settings.handlers'

export const allHandlers = {
    'droptimizer-add': addDroptimizerHandler,
    'droptimizer-list': getDroptimizerListHandler,
    'droptimizer-delete': deleteDroptimizerHandler,
    'droptimizer-discord-sync': syncDroptimizersFromDiscord,
    'droptimizer-last-char-diff': getDroptimizerLastByCharAndDiffHandler,
    'character-add': addCharacterHandler,
    'character-get': getCharacterHandler,
    'character-list': getChracterListHandler,
    'character-delete': deleteCharacterHandler,
    'character-edit': editCharacterHandler,
    'character-sync-wowaudit': syncCharacterWowAudit,
    'player-add': addPlayerHandler,
    'player-delete': deletePlayerHandler,
    'player-edit': editPlayerHandler,
    'player-list': getPlayerWithCharactersListHandler,
    'upsert-json-data': upsertJsonDataHandler,
    'items-list': getItemsHandler,
    'items-search': searchItemsHandler,
    'boss-loot-table-get': getRaidLootTableHandler,
    'boss-list': getBossesHandler,
    'raid-session-list': getRaidSessionListHandler,
    'raid-session-get': getRaidSessionHandler,
    'raid-session-add': addRaidSessionHandler,
    'raid-session-edit': editRaidSessionHandler,
    'raid-session-delete': deleteRaidSessionHandler,
    'loots-add-rcloot': addRaidLootsByRCLootCsvHandler,
    'loots-add-manual': addRaidLootsByManualInputHandler,
    'loots-get-by-session': getLootsBySessionIdHandler,
    'app-settings-get': getAppSettingsHandler,
    'app-settings-edit': setAppSettingsHandler,
    'app-settings-reset': resetAppSettingsHandler
}
