import { BrowserWindow, ipcRenderer } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";

if (!ipcRenderer) throw new Error("Renderer process not found");

/**
 * Powercord-like interface for RikkaNative wrapper
 * Mainly here to make it easier for compat layers
 * such as Topaz to replicate IPC.
 * */
export const RikkaNative = {
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

  showDialog(params: Electron.MessageBoxSyncOptions) {
    return ipcRenderer.invoke(IPC_Consts.SHOW_DIALOG, params);
  },

  getWindowMaximized() {
    return ipcRenderer.invoke(IPC_Consts.GET_WINDOW_MAXIMIZED);
  },

  getPreload(): string {
    return ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
  },

  __compileSass(file: any) {
    return ipcRenderer.invoke(IPC_Consts.__COMPILE_SASS, undefined, file);
  },
};
