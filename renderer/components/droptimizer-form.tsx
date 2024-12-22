import { DroptimizerItem } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "./hooks/use-toast";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const newDroptimizerSchema = z.object({
    url: z.string().min(1),
});

export default function NewDroptimizerForm() {
    const form = useForm<z.infer<typeof newDroptimizerSchema>>({
        resolver: zodResolver(newDroptimizerSchema),
        defaultValues: {
            url: "",
        },
    });

    const { toast } = useToast();

    function persistPlayerUpgrade(data: {
        playerName: string;
        fightStyle: string;
        targets: number;
        time: number;
        difficulty: string;
        droptimizerUrl: string;
        upgrade: DroptimizerItem[];
    }) {
        const players = JSON.parse(window.localStorage.getItem("players")) || [];
        const playerIndex = players.findIndex((p) => p.character === data.playerName);

        if (playerIndex === -1) {
            toast({
                title: "Player non esistente",
                description: `Il pg ${data.playerName} non esiste.`,
            });
            return;
        }

        players[playerIndex] = {
            ...players[playerIndex],
            fightStyle: data.fightStyle,
            targets: data.targets,
            time: data.time,
            difficulty: data.difficulty,
            upgrades: data.upgrade,
        };

        window.localStorage.setItem("players", JSON.stringify(players));

        toast({
            title: "Aggiunta droptimizer",
            description: `Il droptimizer per il pg ${data.playerName} è stato aggiunto con successo.`,
        });
    }

    async function onSubmit(values: z.infer<typeof newDroptimizerSchema>) {
        const response = await fetch(`${values.url}/data.csv`);
        const data = await response.text();
        let csvData = data.split("\n").map((row) => ({ name: row.split(",")[0], dmg: row.split(",")[1] }));
        csvData = csvData.slice(1);
        const charName = csvData[0].name;
        const charBaseDmg = csvData[0].dmg;

        const parsedData = csvData
            .slice(1)
            .map((d) => ({
                name: d.name.split("/")[3],
                dmg: Math.round(Number(d.dmg) - Number(charBaseDmg)),
            }))
            .filter((d) => d.dmg > 0);

        const response2 = await fetch(`${values.url}/data.json`);
        const data2 = await response2.json();
        const fightStyle = data2.sim.options.fight_style;
        const targets = data2.sim.options.desired_targets;
        const time = data2.sim.options.max_time;
        const difficulty = data2.simbot.title.split("•")[2].replaceAll(" ", "");

        persistPlayerUpgrade({
            playerName: charName,
            fightStyle,
            targets,
            time,
            droptimizerUrl: values.url,
            difficulty,
            upgrade: parsedData,
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 min-w-[600px]">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Droptimizer URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="disabled:bg-gray-500">
                    Submit
                </Button>
            </form>
        </Form>
    );
}