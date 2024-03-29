import { ipcMain, BrowserWindow, dialog } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";
import {
  clearCache, compileSass, DevToolsClose, DevToolsOpen,
} from "@rikka/modules/util";

if (!ipcMain) throw new Error("Main process not found");

function createHeadersHook(e: Electron.IpcMainInvokeEvent, name: string, code: string) {
  // electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => eval(code)({ responseHeaders }, done));
}

function showDialog(e: Electron.IpcMainInvokeEvent, params: Electron.MessageBoxSyncOptions) {
  dialog.showMessageBox({
    title: params.title,
    type: params.type,
    message: params.message,
    detail: params.detail,
    buttons: params.buttons,
  });
}

// eslint-disable-next-line no-return-assign
ipcMain.on(IPC_Consts.GET_PRELOAD, (e) => e.returnValue = (e.sender as any)._rikkaPreload);
ipcMain.handle(IPC_Consts.OPEN_DEVTOOLS, DevToolsOpen);
ipcMain.handle(IPC_Consts.CLOSE_DEVTOOLS, DevToolsClose);
ipcMain.handle(IPC_Consts.CLEAR_CACHE, clearCache);
ipcMain.handle(IPC_Consts.__COMPILE_SASS, compileSass);
ipcMain.handle(IPC_Consts.GET_WINDOW_MAXIMIZED, (e) => BrowserWindow.fromWebContents(e.sender)?.isMaximized());
// eslint-disable-next-line no-return-assign
ipcMain.handle(IPC_Consts.ADD_HEADER_HOOK, createHeadersHook);
ipcMain.handle(IPC_Consts.SHOW_DIALOG, showDialog);
