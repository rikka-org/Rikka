import PCPluginsManager from "./managers/PluginLoader";
import { join } from "path";
import * as pkg from "../package.json"
import Updatable from "../NodeMod/powercord/entities/Updatable";
import APIManager from "./managers/API";
import Logger from "../Common/Logger";
import modules from "./modules";
import styleManager from "./managers/styleManager";
import Webpack from "../powercord-git/src/fake_node_modules/powercord/webpack";

let hide_rikka = false;

export default class Powercord extends Updatable {
    api = new APIManager();

    pluginManager = new PCPluginsManager();

    styleManager = new styleManager();

    initialized: boolean = false;

    settings: any;

    gitInfos = {
        upstream: 'https://github.com/powercord-org/powercord',
        branch: 'v2',
        revision: '7'
    };

    private account? = null;

    private isLinking = false;

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

        await Promise.all(modules.map((mdl: () => any) => mdl()));
        this.emit('initializing');

        await this.startup();
        //(this.gitInfos = await this.pluginManager.get('pc-updater') as any)?.getGitInfos();

        if (this.settings.get('hideToken', true)) {
            const tokenModule = await require('powercord/webpack').getModule(['hideToken']);
            tokenModule.hideToken = () => void 0;
            setImmediate(() => tokenModule.showToken()); // just to be sure
        }

        window.addEventListener('beforeunload', () => {
            if (this.account && this.settings.get('settingsSync', false))
                powercord.api.settings.upload();
        });

        this.emit('loaded');
    }

    async startup() {
        await this.api.startAPIs();
        this.settings = powercord.api.settings.buildCategoryObject('pc-general');
        this.emit('settingsReady');

        const coremods = require('./coremods');
        await coremods.load();

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
}
