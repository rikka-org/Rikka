import { ipcRenderer, webFrame } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";

function defineWindowGetter(key: string, getter: () => any) {
  Object.defineProperty(window, key, {
    get: getter,
  });
}

function defineWebframe(key: string) {
  defineWindowGetter(key, () => (webFrame.top as any).context.window[key]);
}

Object.defineProperty(window, 'platform', {
  get: () => (webFrame.top as any).context.window.platform
});

Object.defineProperty(window, '_', {
  get: () => (webFrame.top as any).context.window._
});

Object.defineProperty(window, 'webpackChunkdiscord_app', {
  get: () => (webFrame.top! as any).context.window.webpackChunkdiscord_app
});

Object.defineProperty(window, 'GLOBAL_ENV', {
  get: () => (webFrame.top! as any).context.window.GLOBAL_ENV
});

Object.defineProperty(window, 'DiscordSentry', {
  get: () => (webFrame.top! as any).context.window.DiscordSentry
});

Object.defineProperty(window, '__SENTRY__', {
  get: () => (webFrame.top! as any).context.window.__SENTRY__
});

// Adding fake modules
//require('module').Module.globalPaths.push(join(__dirname, 'NodeMod'));

// Initializing Rikka loader
import Rikka from "@rikka/index";
const rikka = new Rikka();
// @ts-ignore
global.rikka = rikka;

const discordPreload = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (discordPreload) {
  require(discordPreload);
}

setTimeout(() => DiscordNative.window.setDevtoolsCallbacks(null, null), 5e3);
