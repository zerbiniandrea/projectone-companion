import { CharacterForm } from '@renderer/components/character-form'
import { AnimatedTooltip } from '@renderer/components/ui/animated-tooltip'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@renderer/components/ui/table'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import { useQuery } from '@tanstack/react-query'
import { Edit, LoaderCircle, Trash } from 'lucide-react'
import { useState } from 'react'

export default function RosterPage(): JSX.Element {
    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.players],
        queryFn: fetchPlayers
    })
    const [displayAddCharacter, setDisplayAddCharacter] = useState(false)
    return (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                    <LoaderCircle className="animate-spin text-5xl" />
                </div>
            ) : (
                <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8">
                    <div className="grid grid-cols-3 w-full items-center">
                        <div></div>
                        <h1 className="mx-auto text-2xl font-bold">Roster</h1>
                        <div className="flex items-center justify-center">
                            <button className="bg-primary text-background hover:bg-primary/80 rounded-md px-4 py-2">
                                Add player
                            </button>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="">
                                <TableHead>Players</TableHead>
                                <TableHead>Chars</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.players.map((player) => (
                                <TableRow key={player.id} className="h-[100px]">
                                    <TableCell className="font-bold text-xl">
                                        {player.playerName}
                                    </TableCell>
                                    {player.characters ? (
                                        <TableCell>
                                            <AnimatedTooltip items={[...player.characters]} />
                                        </TableCell>
                                    ) : null}
                                    <TableCell className="flex items-center gap-x-2 h-[100px]">
                                        <Edit className="cursor-pointer" />
                                        <Trash className="cursor-pointer" />
                                        <CharacterForm playerName={player.playerName} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    )
}
