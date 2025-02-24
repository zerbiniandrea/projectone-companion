import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { itemSlotIcon } from '@renderer/lib/wow-icon'
import { ITEM_SLOTS_KEY } from '@shared/consts/wow.consts'
import { formatWowSlotKey } from '@shared/libs/items/item-slot-utils'
import { wowItemSlotKeySchema } from '@shared/schemas/wow.schemas'
import { LootWithAssigned } from '@shared/types/types'
import LootItem from './loots-item'

type LootsTabsProps = {
    loots: LootWithAssigned[]
    selectedLoot: LootWithAssigned | null
    setSelectedLoot: (loot: LootWithAssigned) => void
}

const LootsTabs = ({ loots, selectedLoot, setSelectedLoot }: LootsTabsProps) => {
    const renderLoots = (slot) => {
        const filteredLoots = loots
            .filter((loot) => loot.gearItem.item.slotKey === slot)
            .sort((a, b) => {
                if (a.gearItem.item.token !== b.gearItem.item.token) {
                    return a.gearItem.item.token ? -1 : 1
                }
                if (a.gearItem.item.armorType !== b.gearItem.item.armorType) {
                    if (a.gearItem.item.armorType === null) return 1
                    if (b.gearItem.item.armorType === null) return -1
                    return a.gearItem.item.armorType.localeCompare(b.gearItem.item.armorType)
                }
                if (a.gearItem.item.id !== b.gearItem.item.id) {
                    return a.gearItem.item.id - b.gearItem.item.id
                }
                return a.id.localeCompare(b.id)
            })

        if (filteredLoots.length === 0) {
            return <p className="text-gray-400">No loot in this category</p>
        }

        return filteredLoots.map((loot, index) => (
            <LootItem
                key={index}
                loot={loot}
                isSelected={selectedLoot != null && selectedLoot.id === loot.id}
                setSelectedLoot={setSelectedLoot}
            />
        ))
    }

    return (
        <Tabs defaultValue={ITEM_SLOTS_KEY[0]}>
            <TabsList className="flex flex-wrap pb-2">
                <div className="flex flex-wrap gap-2">
                    {wowItemSlotKeySchema.options.map((slot) => (
                        <TabsTrigger
                            value={slot}
                            key={slot}
                            className="flex flex-col items-start gap-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            <div className={`cursor-pointer transition-transform hover:scale-125`}>
                                <img
                                    src={itemSlotIcon.get(slot)}
                                    alt={slot}
                                    className="w-7 h-7"
                                    title={formatWowSlotKey(slot)}
                                />
                            </div>
                        </TabsTrigger>
                    ))}
                </div>
            </TabsList>
            {ITEM_SLOTS_KEY.map((slot) => (
                <TabsContent
                    key={slot}
                    value={slot}
                    className="bg-muted p-4 rounded-lg shadow-md mt-2"
                >
                    {renderLoots(slot)}
                </TabsContent>
            ))}
        </Tabs>
    )
}

export default LootsTabs
