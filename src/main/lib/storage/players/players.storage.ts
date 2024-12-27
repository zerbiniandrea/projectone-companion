import { eq } from 'drizzle-orm'
import {
    charactersListSchema,
    playerSchema
} from '../../../../../shared/schemas/characters.schemas'
import { NewCharacter, Player } from '../../../../../shared/types/types'
import { newUUID } from '../../utils'
import { db } from '../storage.config'
import { charTable, playerTable } from '../storage.schema'
import { takeFirstResult } from '../storage.utils'

export const getCharactersList = async (): Promise<{ players: Player[] } | null> => {
    const result = await db.select().from(playerTable)

    if (!result) {
        return null
    }

    const playersWithCharacters = await Promise.all(
        result.map(async (player) => {
            const charactersResult = await db
                .select()
                .from(charTable)
                .where(eq(charTable.playerId, player.id))

            const playerWithCharacters = {
                id: player.id,
                playerName: player.name,
                characters: charactersListSchema.parse({
                    characters: charactersResult.map((c) => ({
                        id: c.id,
                        characterName: c.name,
                        class: c.class,
                        role: c.role
                    }))
                }).characters
            }

            return playerWithCharacters
        })
    )

    return { players: playersWithCharacters }
}

export const getPlayerById = async (playerId: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.id, playerId))
        .then(takeFirstResult)

    if (!result) {
        return null
    }

    return playerSchema.parse(result)
}

export const getPlayerByName = async (playerName: string): Promise<Player | null> => {
    const result = await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.name, playerName))
        .then(takeFirstResult)

    if (!result) {
        return null
    }

    return playerSchema.parse(result)
}

export const addCharacter = async (character: NewCharacter): Promise<Player> => {
    const player =
        (await getPlayerByName(character.playerName)) ?? (await addPlayer(character.playerName))

    const result = await db
        .insert(charTable)
        .values({
            id: newUUID(),
            name: character.characterName,
            class: character.class,
            role: character.role,
            playerId: player.id
        })
        .returning()
        .execute()
        .then(takeFirstResult)

    return playerSchema.parse(result)
}

const addPlayer = async (playerName: string): Promise<Player> => {
    const result = await db
        .insert(playerTable)
        .values({
            id: newUUID(),
            name: playerName
        })
        .returning()
        .execute()
        .then(takeFirstResult)

    return playerSchema.parse(result)
}
