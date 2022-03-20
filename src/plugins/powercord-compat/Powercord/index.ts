import PCPluginsManager from "./managers/PluginLoader";
import { join, resolve } from "path";
import * as pkg from "../package.json"
import Updatable from "../NodeMod/powercord/entities/Updatable";
import APIManager from "./managers/API";
import Logger from "../Common/Logger";
import { RikkaPowercord } from "../Common/Constants";
import modules from "./modules";

const Webpack = require("../NodeMod/powercord/webpack");

const powercordModules = require(resolve(RikkaPowercord.Constants.powercordDir, "modules"));

let hide_rikka = false;

export default class Powercord extends Updatable {
    api = new APIManager();
    private pluginManager = new PCPluginsManager();
    initialized: boolean = false;

    constructor(hidden: boolean = true) {
        super(join(__dirname, '..', '..'), '', 'powercord-compat');
        hide_rikka = hidden;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        Logger.trace("Starting Powercord Emulator");

        await Webpack.init();

        //await Promise.all(powercordModules.map((mdl: () => any) => mdl()));
        await Promise.all(modules.map((mdl: () => any) => mdl()));
        this.emit('initializing');

        await this.startup();
        this.emit('loaded');
    }

    async startup() {
        await this.api.startAPIs();
        this.emit('settingsReady');

        await this.pluginManager.loadPlugins();
        this.initialized = true;
    }

    get rikkapc_version() {
        if (hide_rikka) {
            Logger.trace("A plugin is trying to access Rikka's version when Rikka is hidden.");
            return;
        }
        return pkg.version;
    }

    get settings() {
        return [];
    }
}
