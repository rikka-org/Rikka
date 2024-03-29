/* eslint-disable no-console */
import { ipcRenderer } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";
import StyleManager from "@rikka/managers/StyleManager";

require("./Rikka/IPC/renderer");

// Original preload
const preloader = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (preloader) {
  require(preloader);
}

window.__SPLASH__ = true;

function init() {
  document.body.classList.add("rikka");
  const styleman = new StyleManager();
  styleman._loadThemes();
  styleman._applyThemes();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
