import { ipcMain, BrowserWindow } from "electron";
import { IPC_Consts } from "../../API/Rikka/Constants/IPC_Consts";

if (!ipcMain) throw new Error("Main process not found");

function DevToolsOpen(e: Electron.IpcMainEvent, opts: Electron.OpenDevToolsOptions, window: BrowserWindow) {
    e.sender.openDevTools(opts);
    if (window) {
        //@ts-ignore - Wrong wrong wrong
        let devWindow = new BrowserWindow({ webContents: e.sender.devToolsWebContents });
        devWindow.on('ready-to-show', () => devWindow.show());
        devWindow.on('close', () => {
            e.sender.closeDevTools();
            devWindow.destroy();
        });
    }
}

ipcMain.on(IPC_Consts.GET_PRELOAD, e => e.returnValue = (e.sender as WebContents)._rikkaPreload);