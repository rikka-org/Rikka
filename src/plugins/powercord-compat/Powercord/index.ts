import PCPluginsManager from "../PluginLoader";
import APIManager from "../powercord-git/src/Powercord/managers/apis";
import Updatable from "../powercord-git/src/fake_node_modules/powercord/entities/Updatable";
import { join } from "path";
import modules from "../powercord-git/src/Powercord/modules";
import Webpack from "../powercord-git/src/fake_node_modules/powercord/webpack";
import * as pkg from "../package.json"

let hide_rikka = false;

export default class Powercord extends Updatable {
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
        let caller = arguments.callee.caller;
        while (caller.caller) {
            caller = caller.caller;
        }
        if (hide_rikka) {
            console.log(`A plugin is trying to access Rikka's version when Rikka is hidden. ${caller.name}`);
            return;
        }
        return pkg.version;
    }

    get settings() {
        return [];
    }

    async init() {
        // Webpack & Modules
        console.log("ok 243242345");
        //await Webpack.init();
        //await Promise.all(modules.map(mdl => mdl()));
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