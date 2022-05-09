/* eslint-disable no-plusplus */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-setter-return */
/* eslint-disable no-return-assign */
import { ipcRenderer, webFrame } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";
import { docFixCallbacks, registerCallback } from "@rikka/modules/util/preloadTils/registerDocFix";

// Initializing Rikka loader
import Rikka from "@rikka/index";

function setGlobal(key: string, main: boolean = false) {
  Object.defineProperty(main ? (webFrame as any).top?.context : window, key, {
    get: () => (main ? window : (webFrame as any).top?.context)[key],
    set: (v) => (main ? window : (webFrame as any).top?.context)[key] = v,
  });
}

function fixDocument() {
  let getI = 0;
  let setI = 0;

  /**
   * Allow accessing React root container.
   */
  Object.defineProperty(HTMLElement.prototype, "_reactRootContainer", {
    get() {
      docFixCallbacks.forEach((cb) => cb.getDoc(this, getI++, setI));

      return this._reactRootContainer;
    },
    // @ts-ignore this is inherintly unsafe
    set(prop: string | number, value: any) {
      docFixCallbacks.forEach((cb) => cb.setDoc(this, prop, value, getI++, setI++));

      return this && (this[prop] = value);
    },
  });
}

registerCallback({
  getDoc: (element, getI) => {
    const realDoc = (webFrame as any).top?.context.document;

    getI++;
    element.setAttribute("rk-react-root-get", getI);
    const elem = realDoc.querySelector(`[rk-react-root-get='${getI}']`);
    elem?.removeAttribute("rk-react-root-get");
    return elem?._reactRootContainer;
  },
  setDoc: (element, prop, value, getI, setI) => {
    const realDoc = (webFrame as any).top?.context.document;

    setI++;
    element.setAttribute("rk-react-root-set", setI);
    const elem = realDoc.querySelector(`[rk-react-root-set='${setI}']`);
    elem?.removeAttribute("rk-react-root-set");
    elem[prop] = value;
  },
});

setGlobal("DiscordSentry");
setGlobal("__SENTRY__");
setGlobal("GLOBAL_ENV");
setGlobal("platform");
setGlobal("_");
setGlobal("webpackChunkdiscord_app");
setGlobal("WebSocket", true);

fixDocument();

const rikkaInstance = new Rikka();
window.rikka = rikkaInstance;
window.$rk = rikkaInstance;

setGlobal("rikka", true);
setGlobal("discord", true);
setGlobal("$rk", true);
setGlobal("$discord", true);
setGlobal("require", true);

// https://github.com/electron/electron/issues/9047
if (process.platform === "darwin" && !process.env.PATH?.includes("/usr/local/bin")) {
  process.env.PATH += ":/usr/local/bin";
}

const discordPreload = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (discordPreload) {
  // @ts-ignore
  process._linkedBinding("electron_common_command_line").appendSwitch("preload", discordPreload);
  require(discordPreload);
}

setTimeout(() => DiscordNative.window.setDevtoolsCallbacks(null, null), 5e3);
