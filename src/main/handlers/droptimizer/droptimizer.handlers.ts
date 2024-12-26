import { Droptimizer, NewDroptimizer } from '../../../../shared/types'
import { addDroptimizer } from '../../lib/storage/droptimizer/droptimizer.storage'
import { fetchRaidbotsData, parseRaidbotsData } from './droptimizer.utils'

export const addDroptimizerHandler = async (url: string): Promise<Droptimizer | null> => {
    console.log('Adding droptimizer from url', url)

    const { csvData, jsonData } = await fetchRaidbotsData(url)

    const { parsedCsv, parsedJson } = parseRaidbotsData(csvData, jsonData)

    // todo: salvare anche gli upgrades
    const droptimizer: NewDroptimizer = {
        characterName: parsedCsv.characterName,
        raidDifficulty: parsedJson.difficulty,
        fightInfo: {
            fightstyle: parsedJson.fightStyle,
            duration: parsedJson.duration,
            nTargets: parsedJson.targets
        },
        url,
        resultRaw: csvData,
        date: parsedJson.date,
        upgrades: parsedCsv.upgrades
    }

    return await addDroptimizer(droptimizer)
}
