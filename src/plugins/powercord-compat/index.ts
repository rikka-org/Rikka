import { join } from "path";
import { RikkaPlugin } from "../../Common/Plugin";

import pkg from "./package.json";
import PCPluginsManager from "./PluginLoader";

export default class PowercordCompat extends RikkaPlugin {
    Manifest = {
        name: "Powercord Compat",
        description: "Adds Powercord support to Rikka",
        author: "V3L0C1T13S",
        version: pkg.version,
        license: "MIT",
        dependencies: []
    }

    private PluginsManager = new PCPluginsManager();

    async inject() {
        console.log("Powercord compat is enabled!");
        // Push NodeMod directly to the global scope
        require('module').Module.globalPaths.push(join(__dirname, 'NodeMod'));
        this.PluginsManager.loadPlugins();
    }
}