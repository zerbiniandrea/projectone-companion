/* eslint-disable @typescript-eslint/ban-ts-comment */
import { electronAPI } from '@electron-toolkit/preload'
import type {
    AppSettings,
    Boss,
    Character,
    Droptimizer,
    EditCharacter,
    EditPlayer,
    EditRaidSession,
    Item,
    NewCharacter,
    NewLootsFromManualInput,
    NewLootsFromRc,
    NewPlayer,
    NewRaidSession,
    Player,
    RaidSession
} from '@shared/types/types'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
export const api = {
    // Characters
    addCharacter(character: NewCharacter): Promise<Character> {
        return ipcRenderer.invoke('character-add', character)
    },
    getCharactersList(): Promise<Character[]> {
        return ipcRenderer.invoke('character-list')
    },
    deleteCharacter(id: string): Promise<void> {
        return ipcRenderer.invoke('character-delete', id)
    },
    editCharacter(edited: EditCharacter): Promise<Character> {
        return ipcRenderer.invoke('character-edit', edited)
    },
    getPlayerList(): Promise<Player[]> {
        return ipcRenderer.invoke('player-list')
    },
    addPlayer(player: NewPlayer): Promise<Player> {
        return ipcRenderer.invoke('player-add', player)
    },
    editPlayer(player: EditPlayer): Promise<Player> {
        return ipcRenderer.invoke('player-edit', player)
    },
    deletePlayer(id: string): Promise<void> {
        return ipcRenderer.invoke('player-delete', id)
    },
    // Droptimizers
    addDroptimizer(url: string): Promise<Droptimizer> {
        return ipcRenderer.invoke('droptimizer-add', url)
    },
    getDroptimizerList(): Promise<Droptimizer[]> {
        return ipcRenderer.invoke('droptimizer-list')
    },
    deleteDroptimizer(url: string): Promise<void> {
        return ipcRenderer.invoke('droptimizer-delete', url)
    },
    syncDroptimizerFromDiscord(): Promise<void> {
        return ipcRenderer.invoke('droptimizer-discord-sync')
    },
    // Raid loot table
    getRaidLootTable(raidId: number): Promise<Boss[]> {
        return ipcRenderer.invoke('loot-table-get', raidId)
    },
    // Raid sessions
    addRaidSession(newSession: NewRaidSession): Promise<RaidSession> {
        return ipcRenderer.invoke('raid-session-add', newSession)
    },
    editRaidSession(editedSession: EditRaidSession): Promise<RaidSession> {
        return ipcRenderer.invoke('raid-session-edit', editedSession)
    },
    getRaidSession(id: string): Promise<RaidSession> {
        return ipcRenderer.invoke('raid-session-get', id)
    },
    getRaidSessions(): Promise<RaidSession[]> {
        return ipcRenderer.invoke('raid-session-list')
    },
    deleteRaidSession(id: string): Promise<void> {
        return ipcRenderer.invoke('raid-session-delete', id)
    },
    // Loots
    addLootsManual(loots: NewLootsFromManualInput): Promise<void> {
        return ipcRenderer.invoke('loots-add-manual', loots)
    },
    addLootsFromRc(loots: NewLootsFromRc): Promise<void> {
        return ipcRenderer.invoke('loots-add-rcloot', loots)
    },
    // App settings
    getAppSettings(): Promise<AppSettings> {
        return ipcRenderer.invoke('app-settings-get')
    },
    editAppSettings(settings: AppSettings): Promise<void> {
        return ipcRenderer.invoke('app-settings-edit', settings)
    },
    resetAppSettings(): Promise<void> {
        return ipcRenderer.invoke('app-settings-reset')
    },
    // JSON Data
    upsertJsonData(): Promise<void> {
        return ipcRenderer.invoke('upsert-json-data')
    },
    // Items
    getItems(): Promise<Item[]> {
        return ipcRenderer.invoke('items-list')
    },
    searchItems(searchTerm: string, limit: number): Promise<Item[]> {
        return ipcRenderer.invoke('items-search', searchTerm, limit)
    }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
