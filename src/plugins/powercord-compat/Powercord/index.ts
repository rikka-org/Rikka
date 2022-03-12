import PCPluginsManager from "../PluginLoader";
import APIManager from "../powercord-git/src/Powercord/managers/apis";
import Updatable from "../powercord-git/src/fake_node_modules/powercord/entities/Updatable";
import { join } from "path";
import modules from "../powercord-git/src/Powercord/modules";
import Webpack from "../powercord-git/src/fake_node_modules/powercord/webpack";
import * as pkg from "../package.json"
import vPowercord from "../powercord-git/src/Powercord";

let hide_rikka = false;

export class PowercordV2 extends vPowercord {
    pluginManager = new PCPluginsManager();

    //@ts-ignore
    constructor(hidden: boolean = false) {
        // Call Updatable constructor
        //@ts-ignore
        Updatable.call(this, join(__dirname, '..', '..'), '', 'powercord-compat');
        //@ts-ignore
        global.powercord = this;
        //@ts-ignore
        this.init();
    }
}

export default class PowercordEmu extends Updatable {
    private api = new APIManager();
    private pluginManager = new PCPluginsManager();

    constructor(hidden: boolean = false) {
        super(join(__dirname, '..', '..'), '', 'powercord-compat');
        hide_rikka = hidden;
        this.init();
    }

    async init() {
        console.log("Starting Powercord Emulator");
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
}

export class Powercord extends Updatable {
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
}