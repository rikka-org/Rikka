import electron from "electron";

/** Allows making interprocess calls into the Electron process. */
export function send(channel: string, ...args: any[]): void {
    electron.ipcRenderer.send(channel, ...args);
}
