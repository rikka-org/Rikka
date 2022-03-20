import { ipcRenderer } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";

// Original preload
const preloader = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (preloader) {
    require(preloader);
}

const ipcrenderer = require("./Rikka/IPC/renderer");
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
