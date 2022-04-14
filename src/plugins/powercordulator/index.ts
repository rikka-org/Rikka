import RikkaPlugin from "@rikka/Common/Plugin";
import { join } from "path";

/** Experimental!!! Probably gonna scrap... */
export default class Powercodulator extends RikkaPlugin {
    Manifest = {
        name: "Powercordulator",
        description: "Adds Powercord support to Rikka by only implementing needed calls",
        author: "V3L0C1T13S",
        version: "0.0.1",
        license: "BSD",
        dependencies: []
    };

    inject() {
        return;

        console.log("Powercordulator is enabled!");

        global.NEW_BACKEND = true;

        require("./powercord-git/src/ipc/renderer");

        // Add Powercord's modules
        require('module').Module.globalPaths.push(join(__dirname, 'powercord-git', 'src', 'fake_node_modules'));

        require("./powercord-git/src/preload");
    }
}