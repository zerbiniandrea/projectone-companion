import {
    addCharacterHandler,
    addPlayerHandler,
    deleteCharacterHandler,
    deletePlayerHandler,
    editCharacterHandler,
    editPlayerHandler,
    getPlayerWithCharactersListHandler
} from './characters/characters.handlers'
import {
    addDroptimizerHandler,
    deleteDroptimizerHandler,
    getDroptimizerListHandler,
    syncDroptimizersFromDiscord
} from './droptimizer/droptimizer.handlers'
import { getItemsHandler, searchItemsHandler } from './items/items.handlers'
import { upsertJsonDataHandler } from './json-data/json-data.handlers'
import {
    addRaidLootsByManualInputHandler,
    addRaidLootsByRCLootCsvHandler,
    addRaidSessionHandler,
    deleteRaidSessionHandler,
    editRaidSessionHandler,
    getRaidSessionHandler,
    getRaidSessionListHandler
} from './raid-session/raid-session.handlers'
import { getRaidLootTableHanlder } from './raid/raid.handler'
import {
    getAppSettingsHandler,
    resetAppSettingsHandler,
    setAppSettingsHandler
} from './settings/settings.handlers'

export const allHandlers = {
    'droptimizer-add': addDroptimizerHandler,
    'droptimizer-list': getDroptimizerListHandler,
    'droptimizer-delete': deleteDroptimizerHandler,
    'droptimizer-discord-sync': syncDroptimizersFromDiscord,
    'character-add': addCharacterHandler,
    //'character-list': todo,
    'character-delete': deleteCharacterHandler,
    'character-edit': editCharacterHandler,
    'player-add': addPlayerHandler,
    'player-delete': deletePlayerHandler,
    'player-edit': editPlayerHandler,
    'player-list': getPlayerWithCharactersListHandler,
    'upsert-json-data': upsertJsonDataHandler,
    'items-list': getItemsHandler,
    'items-search': searchItemsHandler,
    'loot-table-get': getRaidLootTableHanlder,
    'raid-session-list': getRaidSessionListHandler,
    'raid-session-get': getRaidSessionHandler,
    'raid-session-add': addRaidSessionHandler,
    'raid-session-edit': editRaidSessionHandler,
    'raid-session-delete': deleteRaidSessionHandler,
    'loots-add-rcloot': addRaidLootsByRCLootCsvHandler,
    'loots-add-manual': addRaidLootsByManualInputHandler,
    'app-settings-get': getAppSettingsHandler,
    'app-settings-set': setAppSettingsHandler,
    'app-settings-reset': resetAppSettingsHandler
}
