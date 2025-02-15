import * as Tabs from '@radix-ui/react-tabs'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { searchItems } from '@renderer/lib/tanstack-query/items'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addLootsFromRc, addLootsManual } from '@renderer/lib/tanstack-query/loots'
import { RAID_DIFF } from '@shared/consts/wow.consts'
import { Item, NewLootManual, RaidSession, WowRaidDifficulty } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircle, X } from 'lucide-react'
import { useState, type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/text-area'
import { WowItemIcon } from './ui/wowitem-icon'

export default function SessionLootNewDialog({
    isOpen,
    setOpen,
    raidSession
}: {
    isOpen: boolean
    setOpen: (open: boolean) => void
    raidSession: RaidSession
}): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItems, setSelectedItems] = useState<NewLootManual[]>([])
    const [csvData, setCsvData] = useState('')

    const { data: items, isLoading } = useQuery({
        queryKey: [queryKeys.itemSearch, searchTerm],
        queryFn: () => searchItems(searchTerm),
        enabled: searchTerm.length > 2
    })

    const addManualLootsMutation = useMutation({
        mutationFn: ({ raidSessionId, loots }: { raidSessionId: string; loots: NewLootManual[] }) =>
            addLootsManual(raidSessionId, loots),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSession.id] })
            setSelectedItems([])
            setOpen(false)
            toast({ title: 'Loots added', description: 'Loots successfully added.' })
        },
        onError: (error) => {
            toast({ title: 'Error', description: `Failed to add loots. ${error.message}` })
        }
    })

    const addRcLootsMutation = useMutation({
        mutationFn: ({ raidSessionId, csv }: { raidSessionId: string; csv: string }) =>
            addLootsFromRc(raidSessionId, csv),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSession.id] })
            setCsvData('')
            setOpen(false)
            toast({ title: 'RCLoot CSV imported', description: 'Loots successfully imported.' })
        },
        onError: (error) => {
            toast({ title: 'Error', description: `Failed to import CSV. ${error.message}` })
        }
    })

    const handleItemSelect = (item: Item) => {
        const newloot: NewLootManual = {
            itemId: item.id,
            raidDifficulty: 'Heroic',
            hasSocket: false,
            hasAvoidance: false,
            hasLeech: false,
            hasSpeed: false
        }
        setSelectedItems([...selectedItems, newloot])
        setSearchTerm('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>New Loots</DialogTitle>
                    <DialogDescription>
                        Add new loots manually or import from RCLoot
                    </DialogDescription>
                </DialogHeader>
                <Tabs.Root defaultValue="manual" className="w-full">
                    <Tabs.List className="flex border-b mb-4">
                        <Tabs.Trigger
                            value="manual"
                            className="px-4 py-2 flex-1 text-center hover:bg-muted"
                        >
                            Manual Entry
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="rcloot"
                            className="px-4 py-2 flex-1 text-center hover:bg-muted"
                        >
                            RCLoot CSV
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="manual" className="p-4">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for an item..."
                        />
                        {isLoading && <LoaderCircle className="animate-spin text-5xl" />}
                        {items && (
                            <ul className="mt-2 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="cursor-pointer hover:bg-muted p-2"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleItemSelect(item)
                                        }}
                                    >
                                        <WowItemIcon
                                            item={item}
                                            iconOnly={false}
                                            raidDiff="Heroic"
                                            className="mt-2"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="space-y-2 mt-2">
                            {selectedItems.map((selectedItem, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 p-2 border rounded"
                                >
                                    <WowItemIcon
                                        item={selectedItem.itemId}
                                        iconOnly={false}
                                        raidDiff={selectedItem.raidDifficulty}
                                        className="mt-2"
                                    />

                                    {/* Raid Difficulty Selection */}
                                    <Select
                                        value={selectedItem.raidDifficulty}
                                        onValueChange={(value: WowRaidDifficulty) => {
                                            const updatedItems = [...selectedItems]
                                            const lootToUpdate: NewLootManual = updatedItems[index]
                                            lootToUpdate.raidDifficulty = value
                                            setSelectedItems(updatedItems)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RAID_DIFF.map((difficulty) => (
                                                <SelectItem key={difficulty} value={difficulty}>
                                                    {difficulty}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() =>
                                            setSelectedItems(
                                                selectedItems.filter((_, i) => i !== index)
                                            )
                                        }
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="w-full mt-4"
                            onClick={() =>
                                addManualLootsMutation.mutate({
                                    raidSessionId: raidSession.id,
                                    loots: selectedItems
                                })
                            }
                        >
                            Add Loots
                        </Button>
                    </Tabs.Content>
                    <Tabs.Content value="rcloot" className="p-4">
                        <Textarea
                            value={csvData}
                            onChange={(e) => setCsvData(e.target.value)}
                            placeholder="Paste RCLoot CSV data here..."
                            rows={10}
                        />
                        <Button
                            className="w-full mt-4"
                            onClick={() =>
                                addRcLootsMutation.mutate({
                                    raidSessionId: raidSession.id,
                                    csv: csvData
                                })
                            }
                        >
                            Import Loots
                        </Button>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogContent>
        </Dialog>
    )
}
