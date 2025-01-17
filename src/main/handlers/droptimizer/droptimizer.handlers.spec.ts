import { describe, expect, it, jest } from '@jest/globals'
import { ItemToCatalyst, ItemToTierset } from '@shared/types/types'
import { addDroptimizer } from '@storage/droptimizer/droptimizer.storage'
import * as fs from 'fs'
import { addDroptimizerHandler } from './droptimizer.handlers'

jest.mock('./droptimizer.utils', () => {
    const originalModule = jest.requireActual('./droptimizer.utils')
    const fetchRaidbotsDataMock = jest.fn((url: string) => {
        console.log(`Mocking return value for ${url}`)
        let mockJsonData = {}
        // Bubbledan (dh)
        if (url === 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx') {
            mockJsonData = JSON.parse(
                fs.readFileSync('resources/raidbots/testData/bubble-data.json', 'utf8')
            )
        }
        // Shant (hunter)
        else if (url === 'https://www.raidbots.com/simbot/report/2pjCMq6FWPFiVoKajjyiuw') {
            mockJsonData = JSON.parse(
                fs.readFileSync('resources/raidbots/testData/shant-data.json', 'utf8')
            )
        }
        return Promise.resolve(mockJsonData)
    })
    return {
        __esModule: true,
        ...(originalModule as object), // keep other function from the original module
        fetchRaidbotsData: fetchRaidbotsDataMock
    }
})

jest.mock('@storage/droptimizer/droptimizer.storage', () => {
    const originalModule = jest.requireActual('./droptimizer.utils')
    const getItemToTiersetMappingMock = jest.fn((): Promise<ItemToTierset[]> => {
        const tiersetMapping = JSON.parse(
            fs.readFileSync('resources/wow/items_to_tierset.json', 'utf8')
        )
        return Promise.resolve(tiersetMapping)
    })
    const getItemToCatalystMappingMock = jest.fn((): Promise<ItemToCatalyst[]> => {
        const catalystMapping = JSON.parse(
            fs.readFileSync('resources/wow/items_to_catalyst.json', 'utf8')
        )
        return Promise.resolve(catalystMapping)
    })
    return {
        __esModule: true,
        ...(originalModule as object), // keep other function from the original module
        addDroptimizer: jest.fn(),
        getItemToTiersetMapping: getItemToTiersetMappingMock,
        getItemToCatalystMapping: getItemToCatalystMappingMock
    }
})

describe('Droptimizer Handlers', () => {
    it('should throw an error when URL is not provided', async () => {
        await expect(addDroptimizerHandler('')).rejects.toThrow() // non mi interessa validare l'errore specifico
    })

    it('should call addDroptimizerHandler with correct upgrades bubble (no tierset, catalyst)', async () => {
        const testUrl = 'https://www.raidbots.com/simbot/report/cUt45Z5FcaxztdQF9Girzx'

        await addDroptimizerHandler(testUrl)

        const expectedData = {
            ak: '1273,Mythic,Bubbledan,pozzo_delleternità,Havoc,Demon Hunter',
            url: testUrl,
            charInfo: {
                name: 'Bubbledan',
                server: 'pozzo_delleternità',
                class: 'Demon Hunter',
                classId: 12,
                spec: 'Havoc',
                specId: 577,
                talents:
                    'CEkAEDLOxe3SEPP2R8Hw6bhoSYGMzMzgZmZMmJmZGAAAAAAwsMmxMMGLzMz2sNLjZGmZBLbwysYGDzmmGMzMzgN'
            },
            raidInfo: {
                id: 1273,
                difficulty: 'Mythic'
            },
            simInfo: {
                date: 1734552471,
                fightstyle: 'Patchwerk',
                duration: 300,
                nTargets: 1,
                raidbotInput: expect.any(String)
            },
            dateImported: expect.any(Number),
            upgrades: [
                {
                    dps: 10565,
                    catalyzedItemId: null,
                    itemId: 221023,
                    ilvl: 639,
                    slot: 'trinket2'
                },
                {
                    dps: 4794,
                    catalyzedItemId: null,
                    itemId: 220305,
                    ilvl: 639,
                    slot: 'trinket1'
                },
                {
                    dps: 490,
                    catalyzedItemId: 212062,
                    itemId: 225583,
                    ilvl: 639,
                    slot: 'waist'
                },
                {
                    dps: 424,
                    catalyzedItemId: 212062,
                    itemId: 225723,
                    ilvl: 639,
                    slot: 'waist'
                },
                {
                    dps: 267,
                    catalyzedItemId: 212062,
                    itemId: 212425,
                    ilvl: 639,
                    slot: 'waist'
                },
                {
                    dps: 25,
                    catalyzedItemId: 212061,
                    itemId: 212438,
                    ilvl: 639,
                    slot: 'wrist'
                },
                {
                    dps: 14306,
                    catalyzedItemId: null,
                    itemId: 225578,
                    ilvl: 639,
                    slot: 'finger2'
                }
            ]
        }

        expect(addDroptimizer).toHaveBeenCalledTimes(1)
        expect(addDroptimizer).toHaveBeenCalledWith(expectedData)
    })

    it('should call addDroptimizerHandler with correct upgrades shant (tierset, catalyst)', async () => {
        const testUrl = 'https://www.raidbots.com/simbot/report/2pjCMq6FWPFiVoKajjyiuw'

        await addDroptimizerHandler(testUrl)

        const expectedData = {
            ak: '1273,Mythic,Shant,nemesis,Beast Mastery,Hunter',
            url: testUrl,
            charInfo: {
                name: 'Shant',
                server: 'nemesis',
                class: 'Hunter',
                classId: 3,
                spec: 'Beast Mastery',
                specId: 253,
                talents:
                    'C0PAjWdaYGhrXhCioy+K0kCnACMmxGDZB2GN0wGAAAAAAGAAAAAAgZmtZMmZMYmxwMmZYGzMzMTmhxMzMzMmZYYMMzAzwsMzwC'
            },
            raidInfo: {
                id: 1273,
                difficulty: 'Mythic'
            },
            simInfo: {
                date: 1736178842,
                fightstyle: 'Patchwerk',
                duration: 300,
                nTargets: 1,
                raidbotInput: expect.any(String)
            },
            dateImported: expect.any(Number),
            upgrades: [
                {
                    itemId: 212400,
                    slot: 'main_hand',
                    dps: 5602,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225574,
                    slot: 'back',
                    dps: 7725,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212399,
                    slot: 'main_hand',
                    dps: 6035,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225578,
                    slot: 'finger2',
                    dps: 30069,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225576,
                    slot: 'finger2',
                    dps: 10625,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212431,
                    slot: 'feet',
                    dps: 5575,
                    ilvl: 639,
                    catalyzedItemId: 212022
                },
                {
                    itemId: 212456,
                    slot: 'trinket2',
                    dps: 2372,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212447,
                    slot: 'finger2',
                    dps: 12692,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212415,
                    slot: 'wrist',
                    dps: 4847,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225586,
                    slot: 'feet',
                    dps: 6038,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212429,
                    slot: 'shoulder',
                    dps: 2804,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225581,
                    slot: 'wrist',
                    dps: 5977,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212454,
                    slot: 'trinket2',
                    dps: 12422,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225725,
                    slot: 'waist',
                    dps: 2617,
                    ilvl: 639,
                    catalyzedItemId: 212017
                },
                {
                    itemId: 212414,
                    slot: 'waist',
                    dps: 2268,
                    ilvl: 639,
                    catalyzedItemId: 212017
                },
                {
                    itemId: 220305,
                    slot: 'trinket2',
                    dps: 2794,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212435,
                    slot: 'legs',
                    dps: 1261,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225724,
                    slot: 'shoulder',
                    dps: 303,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225577,
                    slot: 'neck',
                    dps: 3834,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 212448,
                    slot: 'neck',
                    dps: 10422,
                    ilvl: 639,
                    catalyzedItemId: null
                },
                {
                    itemId: 225580,
                    slot: 'waist',
                    dps: 2309,
                    ilvl: 639,
                    catalyzedItemId: 212017
                },
                {
                    itemId: 212446,
                    slot: 'back',
                    dps: 5867,
                    ilvl: 639,
                    catalyzedItemId: null
                }
            ]
        }

        expect(addDroptimizer).toHaveBeenCalledTimes(1)
        expect(addDroptimizer).toHaveBeenCalledWith(expectedData)
    })
})
