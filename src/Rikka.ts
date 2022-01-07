import { dirname, join } from "path";
import { LoadPlugins } from "./PluginLoader/Plugins";
const electron = require('electron');
const Module = require('module');

console.log("Rikka is starting...");

const electronPath = require.resolve("electron");
const discordAsar = join(dirname(require.main!.filename), "..", "app.asar");
require.main!.filename = join(discordAsar, 'app_bootstrap/index.js');

const discPackage = require(join(discordAsar, "package.json"));
electron.app.setAppPath(discPackage.name, discordAsar);
electron.app.name = discPackage.name;

electron.app.once('ready', () => {
    LoadPlugins();
})

console.log("Discord is loading...");
Module._load(join(discordAsar, discPackage.main), null, true);
