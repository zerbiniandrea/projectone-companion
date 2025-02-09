import type {
    Character,
    CharacterGameInfo,
    CharacterWithPlayer,
    EditCharacter,
    EditPlayer,
    NewCharacter,
    NewPlayer,
    Player,
    PlayerWithCharacters
} from '@shared/types/types'
import { getDroptimizerLastByChar } from '@storage/droptimizer/droptimizer.storage'
import {
    addCharacter,
    addCharacterWowAudit,
    deleteAllCharacterWowAudit,
    deleteCharacter,
    editCharacter,
    getCharacterWithPlayerById,
    getCharactersWithPlayerList,
    getLastCharacterWowAudit
} from '@storage/players/characters.storage'
import {
    addPlayer,
    deletePlayer,
    editPlayer,
    getPlayerById,
    getPlayerWithCharactersList
} from '@storage/players/players.storage'
import { getConfig } from '@storage/settings/settings.storage'
import { fetchWowAuditData, parseWowAuditData } from './characters.utils'

// Characters

export const addCharacterHandler = async (character: NewCharacter): Promise<Character | null> => {
    const id = await addCharacter(character)
    return await getCharacterWithPlayerById(id)
}

export const getCharacterHandler = async (id: string): Promise<CharacterWithPlayer | null> => {
    return await getCharacterWithPlayerById(id)
}

export const getChracterListHandler = async (): Promise<Character[]> => {
    const res = await getCharactersWithPlayerList()
    return res
}

export const deleteCharacterHandler = async (id: string): Promise<void> => {
    return await deleteCharacter(id)
}

export const editCharacterHandler = async (edited: EditCharacter): Promise<Character | null> => {
    // edit
    await editCharacter(edited)

    // retrieve updated entity
    return await getCharacterWithPlayerById(edited.id)
}

export const syncCharacterWowAudit = async (): Promise<void> => {
    const key = await getConfig('WOW_AUDIT_API_KEY')

    if (key === null) {
        throw new Error('WOW_AUDIT_API_KEY not set in database')
    }

    console.log('[WowAudit] Start Sync')

    const json = await fetchWowAuditData(key)

    if (json != null) {
        const charsData = parseWowAuditData(json)
        await deleteAllCharacterWowAudit()
        await addCharacterWowAudit(charsData)
    }
    console.log('[WowAudit] End Sync')
}

// export const getCharacterListHandler = async (): Promise<Character[]> => {
//     const players = await getPlayerWithCharactersList()
//     return players
// }

// Players

export const addPlayerHandler = async (player: NewPlayer): Promise<Player | null> => {
    const id = await addPlayer(player)
    return await getPlayerById(id)
}

export const deletePlayerHandler = async (playerId: string): Promise<void> => {
    return await deletePlayer(playerId)
}

export const editPlayerHandler = async (edited: EditPlayer): Promise<Player | null> => {
    // edit
    await editPlayer(edited)

    // retrieve updated entity
    return await getPlayerById(edited.id)
}

export const getPlayerWithCharactersListHandler = async (): Promise<PlayerWithCharacters[]> => {
    const players = await getPlayerWithCharactersList()
    return players
}

export const getCharLatestGameInfoHandler = async (
    charName: string,
    charRealm: string
): Promise<CharacterGameInfo> => {
    const lastDroptimizer = await getDroptimizerLastByChar(charName, charRealm)
    const lastWowAudit = await getLastCharacterWowAudit(charName, charRealm)

    const res: CharacterGameInfo = {
        droptimizer: lastDroptimizer,
        wowaudit: lastWowAudit
    }

    return res
}
