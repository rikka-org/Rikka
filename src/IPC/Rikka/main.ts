import { ipcMain } from "electron";
import { IPC_Consts } from "../../API/Rikka/Constants/IPC_Consts";

ipcMain.on(IPC_Consts.GET_PRELOAD, e => e.returnValue = (e.sender as WebContents)._rikkaPreload);