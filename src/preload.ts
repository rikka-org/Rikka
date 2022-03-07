console.log("Test");
import { ipcRenderer, webFrame } from "electron";
import { IPC_Consts } from "./API/Rikka/Constants/IPC_Consts";
import { Rikka } from "./Rikka";

require("./IPC/Rikka/renderer");

const rikka = new Rikka();
//@ts-ignore
global.rikka = rikka;

const discordPreload = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (discordPreload) require(discordPreload);


Object.defineProperty(window, 'platform', {
    get: () => (webFrame.top! as any).context.window.platform
});