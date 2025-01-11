import { Checkbox, CheckedState } from '@radix-ui/react-checkbox'
import * as Collapsible from '@radix-ui/react-collapsible'
import { LootFilter } from '@renderer/lib/filters'
import { armorTypesIcon, itemSlotIcon, raidDiffIcon } from '@renderer/lib/wow-icon'
import { RAID_DIFF } from '@shared/consts/wow.consts'
import { wowArmorTypeSchema, wowItemSlotSchema } from '@shared/schemas/wow.schemas'
import { WowRaidDifficulty } from '@shared/types/types'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type FiltersPanelProps = {
    filter: LootFilter
    updateFilter: (key: string, value: any) => void
}

export const FiltersPanel = ({ filter: filter, updateFilter }: FiltersPanelProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedSlots, setSelectedSlots] = useState<string[]>([])
    const [selectedArmorTypes, setSelectedArmorTypes] = useState<string[]>([])

    const toggleSlot = (slotName: string) => {
        setSelectedSlots((prev) => {
            const newSelectedSlots = prev.includes(slotName)
                ? prev.filter((slot) => slot !== slotName)
                : [...prev, slotName]
            updateFilter('selectedSlots', newSelectedSlots)
            return newSelectedSlots
        })
    }

    const toggleArmorType = (armorType: string) => {
        setSelectedArmorTypes((prev) => {
            const newSelectedArmorTypes = prev.includes(armorType)
                ? prev.filter((type) => type !== armorType)
                : [...prev, armorType]
            updateFilter('selectedArmorTypes', newSelectedArmorTypes)
            return newSelectedArmorTypes
        })
    }

    // Add this function to toggle difficulties
    const toggleDifficulty = (difficulty: WowRaidDifficulty) => {
        const newSelectedDifficulties = filter.selectedRaidDiff.includes(difficulty)
            ? filter.selectedRaidDiff.filter((diff) => diff !== difficulty)
            : [...filter.selectedRaidDiff, difficulty]
        updateFilter('selectedRaidDiff', newSelectedDifficulties)
    }

    return (
        <Collapsible.Root
            className="bg-gray-800 text-white p-6 rounded-lg"
            defaultOpen={false}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            {/* Panel Header */}
            <Collapsible.Trigger className="flex items-center justify-between w-full text-lg font-bold mb-2 cursor-pointer">
                Filters
                <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </Collapsible.Trigger>

            {/* Panel Content */}
            <Collapsible.Content className="mt-4 space-y-4">
                {/* Latest only ( for a given character / spec / diff ) */}
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="only-latest"
                        checked={filter.onlyLatest as CheckedState}
                        onCheckedChange={(checked) => updateFilter('onlyLatest', !!checked)}
                        className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                    >
                        {filter.onlyLatest && <Check className="text-white w-4 h-4" />}
                    </Checkbox>
                    <label htmlFor="only-latest" className="text-sm font-semibold">
                        Latest only ( for a given character / spec / diff )
                    </label>
                </div>

                {/* Ignore droptimizer older than */}
                <div className="flex flex-row items-center gap-3">
                    <Checkbox
                        id="older-than-days"
                        checked={filter.olderThanDays as CheckedState}
                        onCheckedChange={(checked) => updateFilter('olderThanDays', !!checked)}
                        className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                    >
                        {filter.olderThanDays && <Check className="text-white w-4 h-4" />}
                    </Checkbox>
                    <label htmlFor="only-upgrades" className="text-sm font-semibold">
                        Ignore droptimizer older than
                    </label>
                    <input
                        id="upgrade-amount"
                        type="number"
                        min="1"
                        step="1"
                        value={filter.maxDays}
                        onChange={(e) => updateFilter('maxDays', Number(e.target.value))}
                        disabled={!filter.olderThanDays}
                        className={`border rounded-md p-2 bg-gray-700 text-white w-14 ${!filter.olderThanDays ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Upgrades only and Minimum Upgrade Amount in the same row */}
                <div className="flex flex-row items-center gap-3">
                    <Checkbox
                        id="only-upgrades"
                        checked={filter.onlyUpgrades as CheckedState}
                        onCheckedChange={(checked) => updateFilter('onlyUpgrades', !!checked)}
                        className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                    >
                        {filter.onlyUpgrades && <Check className="text-white w-4 h-4" />}
                    </Checkbox>
                    <label htmlFor="only-upgrades" className="text-sm font-semibold">
                        Minimum upgrade
                    </label>
                    <input
                        id="upgrade-amount"
                        type="number"
                        min="0"
                        step="500"
                        value={filter.minUpgrade}
                        onChange={(e) => updateFilter('minUpgrade', Number(e.target.value))}
                        disabled={!filter.onlyUpgrades}
                        className={`border rounded-md p-2 bg-gray-700 text-white w-20 ${!filter.onlyUpgrades ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Raid Difficulty Selector */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold">Raid Difficulty:</label>
                    <div className="flex flex-wrap gap-4">
                        {RAID_DIFF.map((difficulty) => (
                            <div
                                key={difficulty}
                                className={`cursor-pointer transition-transform hover:scale-110 ${
                                    filter.selectedRaidDiff.includes(difficulty)
                                        ? 'ring-2 ring-blue-500'
                                        : 'opacity-50 grayscale'
                                }`}
                                onClick={() => toggleDifficulty(difficulty)}
                            >
                                <img
                                    src={raidDiffIcon.get(difficulty)}
                                    alt={difficulty}
                                    className="w-16 h-16 object-cover"
                                    title={difficulty}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Item Slot Toggles */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold">Item Slots:</label>
                    <div className="flex flex-wrap gap-2">
                        {wowItemSlotSchema.options.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => toggleSlot(slot)}
                                className={`p-1 rounded-md ${
                                    selectedSlots.includes(slot) ? 'bg-blue-600' : 'bg-gray-700'
                                }`}
                                title={slot}
                            >
                                <img src={itemSlotIcon.get(slot)} alt={slot} className="w-6 h-6" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Armor Type Toggles */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold">Armor Types:</label>
                    <div className="flex flex-wrap gap-2">
                        {wowArmorTypeSchema.options.map((armorType) => (
                            <button
                                key={armorType}
                                onClick={() => toggleArmorType(armorType)}
                                className={`p-1 rounded-md ${
                                    selectedArmorTypes.includes(armorType)
                                        ? 'bg-blue-600'
                                        : 'bg-gray-700'
                                }`}
                                title={armorType}
                            >
                                <img
                                    src={armorTypesIcon.get(armorType)}
                                    alt={armorType}
                                    className="w-6 h-6"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </Collapsible.Content>
        </Collapsible.Root>
    )
}
