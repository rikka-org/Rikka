const Module = require('module');
import { dirname, join } from "path";
import electron from "electron";
const PatchedWindow = require("./browserWindow");

if(!require.main) throw new Error("Rikka is not running as a module!");

const electronPath = require.resolve('electron');
const discordAsar = join(dirname(require.main!.filename), "..", "app.asar");
require.main.filename = join(discordAsar, 'app_bootstrap/index.js');

require('./IPC/Rikka/main');

console.log("Rikka is starting...");

let _patched = false;
const appSetAppUserModelId = electron.app.setAppUserModelId;
function setAppUserModelId (...args: any[]) {
  //@ts-ignore WTF?
  appSetAppUserModelId.apply(this as any, args as any);
  if (!_patched) {
    _patched = true;
  }
}

electron.app.setAppUserModelId = setAppUserModelId;

if (!electron.safeStorage) {
  //@ts-ignore you know torvalds was right - private properties are fucking stupid
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

const electronExports = new Proxy(electron, {
    get (target, prop) {
        switch(prop) {
            case 'BrowserWindow': return PatchedWindow;
            //@ts-ignore
            default: return target[prop];
        }
    }
});

delete require.cache[electronPath]?.exports;
require.cache[electronPath]!.exports = electronExports;

const discPackage = require(join(discordAsar, "package.json"));
//@ts-ignore - Completely and utterly wrong
electron.app.setAppPath(discPackage.name, discordAsar);
electron.app.name = discPackage.name;

console.log("Discord is loading...");
//@ts-ignore - Also completely and utterly wrong
Module._load(join(discordAsar, discPackage.main), null, true);
