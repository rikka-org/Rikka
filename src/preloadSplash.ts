import { ipcRenderer } from "electron";
import { join } from "path";
import { IPC_Consts } from "./API/Rikka/Constants/IPC_Consts";

// Begin adding fake modules
require('module').Module.globalPaths.push(join(__dirname, "Nodemod"));
require("./IPC/Rikka/renderer");

// Original preload
const preloader = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (preloader) {
    require(preloader);
}

//@ts-ignore
window.__SPLASH__ = true;

function init() {
    document.body.classList.add("rikka");
    console.log("Rikka loaded");
}

if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
else 
    init();