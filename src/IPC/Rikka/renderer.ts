import { ipcRenderer, webFrame } from "electron";

if (!ipcRenderer) throw new Error("Renderer process not found");

global.RikkaNative = {
    
}