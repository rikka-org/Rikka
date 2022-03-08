import { ipcRenderer, webFrame } from "electron";
import { join } from "path";
import { IPC_Consts } from "./API/Rikka/Constants/IPC_Consts";
import Rikka from "./Rikka";

Object.defineProperty(window, 'platform', {
    get: () => (webFrame.top! as any).context.window.platform
});
// Adding fake modules
require('module').Module.globalPaths.push(join(__dirname, 'NodeMod'));

// Initializing Rikka loader
const rikka = new Rikka();

const discordPreload = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (discordPreload) {
    require(discordPreload);
}

setTimeout(() => DiscordNative.window.setDevtoolsCallbacks(null, null), 5e3);