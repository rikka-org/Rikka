import { IPC_Consts } from "@rikka/API/Constants";
import { ipcRenderer } from "electron";

global.PowercordNative = {
    __compileSass(file: string) {
        return ipcRenderer.invoke(IPC_Consts.__COMPILE_SASS, file);
    }
}
