import { IPC_Consts } from "@rikka/API/Constants";
import { ipcMain, ipcRenderer } from "electron";

if (!ipcMain) throw new Error("IPC not available!");

ipcMain?.handle("POWERCORD_WINDOW_IS_MAXIMIZED", e => ipcRenderer.invoke(IPC_Consts.GET_WINDOW_MAXIMIZED));
