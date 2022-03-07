import { dirname, join } from "path";
import { LoadPlugins } from "./PluginLoader/Plugins";
import electron from "electron";
import Module from "module";
import { PatchedWindow } from "./BrowserWindow";
require('./IPC/Rikka/main');

console.log("Rikka is starting...");

const electronPath = require.resolve("electron");

if(!require.main) throw new Error("Rikka is not running as a module!");

const discordAsar = join(dirname(require.main!.filename), "..", "app.asar");
require.main.filename = join(discordAsar, 'app_bootstrap/index.js');

const discPackage = require(join(discordAsar, "package.json"));
//@ts-ignore - Completely and utterly wrong
electron.app.setAppPath(discPackage.name, discordAsar);
electron.app.name = discPackage.name;


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

console.log("Discord is loading...");
//@ts-ignore - Also completely and utterly wrong
Module._load(join(discordAsar, discPackage.main), null, true);
