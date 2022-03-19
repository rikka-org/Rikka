import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { RikkaPlugin } from "../../Common/Plugin";
import { RikkaPowercord } from "./Common/Constants";
import Logger from "./Common/Logger";
import pkg from "./package.json";

export default class PowercordCompat extends RikkaPlugin {
    Manifest = {
        name: "Powercord Compat",
        description: "Adds Powercord support to Rikka",
        author: "V3L0C1T13S",
        version: pkg.version,
        license: "MIT",
        dependencies: []
    }

    private powercord?: any;

    private powercord_modules_directory = join(__dirname, 'powercord-git', 'src', 'fake_node_modules');
    private placein_modules_directory = join(__dirname, 'NodeMod');

    private experimentalPreload: boolean = true;

    private createDataDirectory() {
        if (!existsSync(RikkaPowercord.Constants.RKPOWERCORD_FOLDER)) {
            mkdirSync(RikkaPowercord.Constants.RKPOWERCORD_FOLDER);
        }
    }

    async inject() {
        console.log("Powercord compat is enabled!");
        // Place-ins are pushed first so they can override the Powercord modules
        require('module').Module.globalPaths.push(this.placein_modules_directory);
        if (this.experimentalPreload) {
            // All other modules are pushed after so they can be overridden by Place-ins
            require('module').Module.globalPaths.push(this.powercord_modules_directory);
        }

        this.createDataDirectory();

        // Might be assigned already
        if (this.powercord) {
            Logger.trace("Powercord already initialized");
            return;
        }

        const Powercord = require("./Powercord");
        global.powercord = new Powercord.default(false);
        this.powercord = global.powercord;
    }
}