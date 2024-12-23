import { addDroptimizer } from "@/lib/storage/droptimizer/droptimizer.storage";
import { NewDroptimizer } from "@/lib/types";
import { isPresent } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "./hooks/use-toast";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
    url: z.string().url(),
});
type FormValues = z.infer<typeof formSchema>;

export default function NewDroptimizerForm() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
        },
    });

    const { toast } = useToast();

    async function parseReport(values: FormValues): Promise<NewDroptimizer> {
        const responseCsv = await fetch(`${values.url}/data.csv`);
        const responseJson = await fetch(`${values.url}/data.json`);
        const csvData = await responseCsv.text();
        const jsonData = await responseJson.json();

        let tmpData = csvData.split("\n").map((row) => ({
            name: row.split(",")[0],
            dmg: row.split(",")[1],
        }));
        tmpData = tmpData.slice(1);
        const charName = tmpData[0].name;
        const charBaseDmg = tmpData[0].dmg;

        const parsedData = tmpData
            .slice(1)
            .map((d) => ({
                name: d.name.split("/")[3],
                dmg: Math.round(Number(d.dmg) - Number(charBaseDmg)),
            }))
            .filter((d) => d.dmg > 0);

        const fightStyle = jsonData.sim.options.fight_style;
        const targets = jsonData.sim.options.desired_targets;
        const time = jsonData.sim.options.max_time;
        const difficulty = jsonData.simbot.title
            .split("•")[2]
            .replaceAll(" ", "");

        const res: NewDroptimizer = {
            characterName: charName,
            raidDifficulty: difficulty,
            fightInfo: {
                fightstyle: fightStyle,
                duration: time,
                nTargets: targets,
            },
            url: values.url,
            resultRaw: "",
            date: 0,
        };

        return res;
    }

    async function onSubmit(values: FormValues) {
        const parsedReport = await parseReport(values);
        const droptimizer = await addDroptimizer(parsedReport);

        isPresent(droptimizer)
            ? toast({
                  title: "Aggiunta droptimizer",
                  description: `Il droptimizer per il pg ${parsedReport.characterName} è stato aggiunto con successo.`,
              })
            : toast({
                  title: "Errore",
                  description: `Non è stato possibile aggiungere il droptimizer per il pg ${parsedReport.characterName}.`,
              });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 min-w-[600px]"
            >
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
