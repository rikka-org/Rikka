import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { RikkaPlugin } from "../../Common/Plugin";
import { RikkaPowercord } from "./Common/Constants";
import pkg from "./package.json";
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

    private powercord?: Powercord;

    private powercord_modules_directory = join(__dirname, 'powercord-git', 'src', 'fake_node_modules');
    private placein_modules_directory = join(__dirname, 'NodeMod');
    private experimentalPreload: boolean = false;

    private createDataDirectory() {
        if(!existsSync(RikkaPowercord.Constants.RKPOWERCORD_FOLDER)) {
            mkdirSync(RikkaPowercord.Constants.RKPOWERCORD_FOLDER);
        }
    }

    inject() {
        console.log("Powercord compat is enabled!");
        //this.bindWebpack();
        // Place-ins are pushed first so they can override the Powercord modules
        require('module').Module.globalPaths.push(this.placein_modules_directory);

        /** DEPRECATED. This method was hacky anyways. */
        //require('module').Module.globalPaths.push(this.powercord_modules_directory);
        
        if(this.experimentalPreload) {
            console.log("Experimental preload is enabled!");
            require("./powercord-git/src/preload");
            return;
        }

        this.createDataDirectory();

        global.powercord = new Powercord(true);
        this.powercord = powercord;
    }
}