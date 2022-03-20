import { IPC_Consts } from "@rikka/API/Constants";
import { ipcMain, ipcRenderer } from "electron";

ipcMain?.handle("POWERCORD_WINDOW_IS_MAXIMIZED", e => ipcRenderer.invoke(IPC_Consts.GET_WINDOW_MAXIMIZED));