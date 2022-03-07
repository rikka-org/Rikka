import { BrowserWindow, ipcRenderer, webFrame } from "electron";
import { IPC_Consts } from "../../API/Rikka/Constants/IPC_Consts";

if (!ipcRenderer) throw new Error("Renderer process not found");

//@ts-ignore
global.RikkaNative = {
    openDevTools(opts: Electron.OpenDevToolsOptions, window: BrowserWindow) {
        return ipcRenderer.invoke(IPC_Consts.OPEN_DEVTOOLS, opts, window);
    },

    closeDevTools(window: BrowserWindow) {
        return ipcRenderer.invoke(IPC_Consts.CLOSE_DEVTOOLS, window);
    },

    openWindow(opts: Electron.BrowserWindowConstructorOptions) {
        return ipcRenderer.invoke(IPC_Consts.OPEN_WINDOW, opts);
    },

    clearCache() {
        return ipcRenderer.invoke(IPC_Consts.CLEAR_CACHE);
    },

    __compileSass(file: any) {
        return ipcRenderer.invoke(IPC_Consts.__COMPILE_SASS, file);
    }
}