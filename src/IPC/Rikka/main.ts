import { ipcMain, BrowserWindow } from "electron";
import { IPC_Consts } from "../../API/Rikka/Constants/IPC_Consts";

if (!ipcMain) throw new Error("Main process not found");

function DevToolsOpen(e: Electron.IpcMainInvokeEvent, opts: Electron.OpenDevToolsOptions, window: BrowserWindow) {
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

function DevToolsClose(e: Electron.IpcMainInvokeEvent) {
    e.sender.closeDevTools();
}

function clearCache(e: Electron.IpcMainInvokeEvent) {
    return new Promise(resolve => {
        e.sender.session.clearCache();
        resolve(null);
    });
}



ipcMain.on(IPC_Consts.GET_PRELOAD, e => e.returnValue = (e.sender as WebContents)._rikkaPreload);
ipcMain.handle(IPC_Consts.OPEN_DEVTOOLS, DevToolsOpen);
ipcMain.handle(IPC_Consts.CLOSE_DEVTOOLS, DevToolsClose);
ipcMain.handle(IPC_Consts.CLEAR_CACHE, clearCache);
