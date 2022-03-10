import { join } from "path";
import { RikkaPlugin } from "../../Common/Plugin";

import pkg from "./package.json";
import PCPluginsManager from "./PluginLoader";
import Powercord from "./Powercord";

export default class PowercordCompat extends RikkaPlugin {
    Manifest = {
        name: "Powercord Compat",
        description: "Adds Powercord support to Rikka",
        author: "V3L0C1T13S",
        version: pkg.version,
        license: "MIT",
        dependencies: []
    }

    private powercord = new Powercord();

    private powercord_modules_directory = join(__dirname, 'powercord-git', 'src', 'fake_node_modules');
    private placein_modules_directory = join(__dirname, 'NodeMod');

    async inject() {
        console.log("Powercord compat is enabled!");
        // Push NodeMod directly to the global scope
        // require('module').Module.globalPaths.push(join(__dirname, 'NodeMod'));
        global.powercord = this.powercord;
        require('module').Module.globalPaths.push(this.powercord_modules_directory);
        this.powercord.pluginManager.loadPlugins();
    }
}
