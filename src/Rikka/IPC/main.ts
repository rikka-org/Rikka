import { ipcMain, BrowserWindow } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";
import { FileHandle, readFile } from "fs/promises";
import sass from "sass";
import electron from "electron";
import { existsSync, PathLike } from "fs";
import { dirname, join } from "path";
import { Logger } from "@rikka/API/Utils";
import { compileSass } from "@rikka/modules/util";

if (!ipcMain) throw new Error("Main process not found");

/** for some reason, after millions of years of evolution,
* countless updates, and many great minds coming together,
* we still have to manually fucking define this bullshit
*/
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

function getChromiumFlags() {

}

function createHeadersHook(e: Electron.IpcMainInvokeEvent, name: string, code: string) {
    electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => eval(code)({ responseHeaders }, done));
}

ipcMain.on(IPC_Consts.GET_PRELOAD, e => e.returnValue = (e.sender as WebContents)._rikkaPreload);
ipcMain.handle(IPC_Consts.OPEN_DEVTOOLS, DevToolsOpen);
ipcMain.handle(IPC_Consts.CLOSE_DEVTOOLS, DevToolsClose);
ipcMain.handle(IPC_Consts.CLEAR_CACHE, clearCache);
ipcMain.handle(IPC_Consts.__COMPILE_SASS, compileSass)
ipcMain.handle(IPC_Consts.GET_WINDOW_MAXIMIZED, e => BrowserWindow.fromWebContents(e.sender)?.isMaximized());
ipcMain.on(IPC_Consts.GET_CHROMIUM_FLAGS, e => e.returnValue = getChromiumFlags());
ipcMain.handle(IPC_Consts.ADD_HEADER_HOOK, createHeadersHook);