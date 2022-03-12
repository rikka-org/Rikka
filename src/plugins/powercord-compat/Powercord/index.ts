import PCPluginsManager from "../PluginLoader";
import { join } from "path";
import * as pkg from "../package.json"
import Updatable from "../NodeMod/powercord/entities/Updatable";
import APIManager from "./managers/API";
import Logger from "../Common/Logger";

let hide_rikka = false;

export default class PowercordEmu extends Updatable {
    api = new APIManager();
    private pluginManager = new PCPluginsManager();
    initialized: boolean = false;

    constructor(hidden: boolean = false) {
        super(join(__dirname, '..', '..'), '', 'powercord-compat');
        // Hack to make plugins work
        global.powercord =  this;
        hide_rikka = hidden;
        this.init();
    }

    async init() {
        Logger.trace("Starting Powercord Emulator");

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

/* export class Powercord extends Updatable {
    private apiManager = new APIManager();
    pluginManager = new PCPluginsManager();
    api = this.apiManager;

    private initialized = false;

    constructor(hidden: boolean = false) {
        super(join(__dirname, '..', '..'), '', 'powercord-compat');
        console.log("ok");
        hide_rikka = hidden;
        // why in gods unholy name this has to be here? i don't know. but it works.
        global.powercord = this;
        this.init();
    }

    get rikkapc_version() {
        if (hide_rikka) {
            console.warn("A plugin is trying to access Rikka's version when Rikka is hidden.");
            return;
        }
        return pkg.version;
    }

    get settings() {
        return [];
    }

    async init() {
        // Webpack & Modules
        await Webpack.init();
        await Promise.all(modules.map(mdl => mdl()));
        this.emit('initializing');

        await this.startup();
        this.emit('loaded');
    }

    async startup() {
        await this.apiManager.startAPIs();
        this.emit('settingsReady');

        console.log("ok");
        await this.pluginManager.loadPlugins();
        this.initialized = true;
    }
} */