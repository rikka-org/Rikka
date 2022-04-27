import Module from "module";
import { dirname, join } from "path";
import electron from "electron";
import PatchedWindow from "./PatchedWindow";
import { preloadPlugins } from "@rikka/Preload";
import electronDevtoolsInstaller, { REACT_DEVELOPER_TOOLS} from "electron-devtools-installer";

if (!require.main) throw new Error("Rikka is not running as a module!");

const electronPath = require.resolve('electron');
const discordAsar = join(dirname(require.main.filename), "..", "app.asar");
require.main.filename = join(discordAsar, 'app_bootstrap/index.js');

require("@rikka/IPC/main");

console.log("Rikka is starting...");

let _patched = false;
const appSetAppUserModelId = electron.app.setAppUserModelId;
function setAppUserModelId(...args: any[]) {
  //@ts-ignore WTF?
  appSetAppUserModelId.apply(this as any, args as any);
  if (!_patched) {
    _patched = true;
  }
}

electron.app.setAppUserModelId = setAppUserModelId;

if (!electron.safeStorage) {
  //@ts-ignore
  electron.safeStorage = {
    isEncryptionAvailable: () => false,
    encryptString: () => {
      throw new Error('Unavailable');
    },
    decryptString: () => {
      throw new Error('Unavailable');
    }
  };
}

const electronExports: any = new Proxy(electron, {
  get(target, prop) {
    switch (prop) {
      case 'BrowserWindow': return PatchedWindow;

      // Discords new way of accessing the main process
      case 'default': return electronExports;
      case '__esModule': return true
      //@ts-ignore
      default: return target[prop];
    }
  }
});

let fakeAppSettings: any;
Object.defineProperty(global, 'appSettings', {
  get () {
    return fakeAppSettings;
  },
  set (value) {
    if (!value.hasOwnProperty('settings')) {
      value.settings = {};
    }
    /** Enable Devtools on Stable builds */
    value.settings.DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING = true;
    fakeAppSettings = value;
  }
});

delete require.cache[electronPath]?.exports;
require.cache[electronPath]!.exports = electronExports;

electron.app.once('ready', () => {
  electronDevtoolsInstaller(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension: ${name}`))
      .catch(err => console.error(`An error occurred: ${err}`));

  // Likely to be deprecated soon in favor of the createHeaders hook
  electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => {
    Object.keys(responseHeaders!)
      .filter(k => (/^content-security-policy/i).test(k))
      .map(k => (delete responseHeaders![k]));

    done({ responseHeaders });
  });
});

const discPackage = require(join(discordAsar, "package.json"));
//@ts-ignore - Hidden property
electron.app.setAppPath(discPackage.name, discordAsar);
electron.app.name = discPackage.name;

// Loading plugins
preloadPlugins();

console.log("Discord is loading...");
//@ts-ignore
Module._load(join(discordAsar, discPackage.main), null, true);
