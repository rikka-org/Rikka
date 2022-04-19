import { BrowserWindow, ipcMain, ipcRenderer } from "electron";

if (!ipcMain) throw new Error("IPC not available!");

ipcMain.handle("POWERCORD_WINDOW_IS_MAXIMIZED", e => BrowserWindow.fromWebContents(e.sender)?.isMaximized());
