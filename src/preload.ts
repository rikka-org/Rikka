import { ipcRenderer, webFrame } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";

function setGlobal(key: string, main: boolean = false) {
  Object.defineProperty(main ? (webFrame as any).top?.context : window, key, {
    get: () => (main ? window : (webFrame as any).top?.context)[key],
    set: (v) => (main ? window : (webFrame as any).top?.context)[key] = v
  });
}


function fixDocument() {
  const realDoc = (webFrame as any).top?.context.document;
  let getI = 0;
  let setI = 0;

  /**
   * Allow accessing React root container.
   */
  Object.defineProperty(HTMLElement.prototype, '_reactRootContainer', {
    get() {
      getI++;
      this.setAttribute('rk-react-root-get', getI);
      const elem = realDoc.querySelector(`[rk-react-root-get='${getI}']`);
      elem?.removeAttribute('rk-react-root-get');
      return elem?._reactRootContainer;
    },
    // @ts-ignore this is inherintly unsafe
    set(prop: string | number, value: any) {
      setI++;
      this.setAttribute('rk-react-root-set', setI);
      const elem = realDoc.querySelector(`[rk-react-root-set='${setI}']`);
      elem?.removeAttribute('rk-react-root-set');
      return elem && (elem[prop] = value);
    }
  });
}

setGlobal('DiscordSentry');
setGlobal('__SENTRY__');
setGlobal('GLOBAL_ENV');
setGlobal('platform');
setGlobal('_');
setGlobal('webpackChunkdiscord_app');
setGlobal('WebSocket', true);

fixDocument();

// Initializing Rikka loader
import Rikka from "@rikka/index";
const rikka = new Rikka();
// @ts-ignore
window.rikka = rikka;

setGlobal('rikka', true);
setGlobal('discord', true);
setGlobal('$rk', true);
setGlobal('$discord', true);
setGlobal('require', true);

// https://github.com/electron/electron/issues/9047
if (process.platform === 'darwin' && !process.env.PATH?.includes('/usr/local/bin')) {
  process.env.PATH += ':/usr/local/bin';
}

const discordPreload = ipcRenderer.sendSync(IPC_Consts.GET_PRELOAD);
if (discordPreload) {
  require(discordPreload);
}

setTimeout(() => DiscordNative.window.setDevtoolsCallbacks(null, null), 5e3);
