import { ipcRenderer } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";
import StyleManager from "@rikka/managers/StyleManagerv2";
require("./Rikka/IPC/renderer");

// Original preload
const preloader = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (preloader) {
    require(preloader);
}

//@ts-ignore
window.__SPLASH__ = true;

function init() {
    document.body.classList.add("rikka");
    console.log("loading styles");
    const styleman = new StyleManager();
    styleman.loadThemes();
    styleman.applyThemes();
    console.log("Rikka loaded");
}

if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
else
    init();
