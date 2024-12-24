import { NewDroptimizer } from "@/lib/types";
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const handler = {
    send(channel: string, value: unknown) {
        ipcRenderer.send(channel, value);
    },
    on(channel: string, callback: (...args: unknown[]) => void) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
            callback(...args);
        ipcRenderer.on(channel, subscription);

        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
};

contextBridge.exposeInMainWorld("ipc", {
    ...handler,
    getDatabaseUrl: () => process.env.DATABASE_URL,
    api: {
        addDroptimizer: (droptimizer: NewDroptimizer) =>
            ipcRenderer.invoke("add-droptimizer", { droptimizer }),
    },
});

export type IpcHandler = typeof handler;
