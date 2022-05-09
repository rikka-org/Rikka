import electron, { ipcMain, BrowserWindow } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";
import {
  clearCache, compileSass, DevToolsClose, DevToolsOpen,
} from "@rikka/modules/util";

if (!ipcMain) throw new Error("Main process not found");

function getChromiumFlags() {

}

function createHeadersHook(e: Electron.IpcMainInvokeEvent, name: string, code: string) {
  electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => eval(code)({ responseHeaders }, done));
}

// eslint-disable-next-line no-return-assign
ipcMain.on(IPC_Consts.GET_PRELOAD, (e) => e.returnValue = (e.sender as any)._rikkaPreload);
ipcMain.handle(IPC_Consts.OPEN_DEVTOOLS, DevToolsOpen);
ipcMain.handle(IPC_Consts.CLOSE_DEVTOOLS, DevToolsClose);
ipcMain.handle(IPC_Consts.CLEAR_CACHE, clearCache);
ipcMain.handle(IPC_Consts.__COMPILE_SASS, compileSass);
ipcMain.handle(IPC_Consts.GET_WINDOW_MAXIMIZED, (e) => BrowserWindow.fromWebContents(e.sender)?.isMaximized());
// eslint-disable-next-line no-return-assign
ipcMain.on(IPC_Consts.GET_CHROMIUM_FLAGS, (e) => e.returnValue = getChromiumFlags());
ipcMain.handle(IPC_Consts.ADD_HEADER_HOOK, createHeadersHook);
