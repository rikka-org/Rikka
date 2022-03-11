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
        require('module').Module.globalPaths.push(join(__dirname, 'powercord-git', 'src', 'fake_node_modules'));
        if(this.experimentalPreload) {
            console.log("Experimental preload is enabled!");
            require("./powercord-git/src/preload");
            return;
        }

        this.createDataDirectory();

        global.powercord = new Powercord(true);
        this.powercord = powercord;
    }

    private bindWebpack() {
        const getFunctions = [
            ['querySelector', false],
            ['querySelectorAll', true],
            ['getElementById', false],
            ['getElementsByClassName', true],
            ['getElementsByName', true],
            ['getElementsByTagName', true],
            ['getElementsByTagNameNS', true]
        ];

        for (const [getMethod, isCollection] of getFunctions) {
            //@ts-ignore
            const realGetter = document[getMethod].bind(document);
            if (isCollection) {
                //@ts-ignore
                document[getMethod] = (...args) => {
                    const webpack = require('powercord/webpack');
                    const nodes = Array.from(realGetter(...args));
                    nodes.forEach((node) => webpack.__lookupReactReference(node));
                    return nodes;
                };
            } else {
                //@ts-ignore
                document[getMethod] = (...args: any[]) => {
                    const webpack = require('powercord/webpack');
                    const node = realGetter(...args);
                    webpack.__lookupReactReference(node);
                    return node;
                };
            }
        }
    }
}