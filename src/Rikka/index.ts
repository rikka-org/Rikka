import APIManager from "./managers/APIManager";
import PluginsManager from "./managers/Plugins";
import StyleManager from "./managers/StyleManager";

export default class Rikka {
    private styleManager = new StyleManager();
    private PluginManager = new PluginsManager();

    /** Deprecated way of accessing plugin APIs */
    //private APIManager = new APIManager();

    /** Is Rikka fully loaded? */
    private ready: boolean = false;

    constructor() {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', () => this.init());
        else
            this.init();
    }

    private async init() {
        await this.start();

        this.ready = true;
    }

    private async start() {
        this.rikkaStartup();
        this.PluginManager.loadPlugins();
    }

    private async rikkaStartup() {
        this.styleManager.applyThemes();
    }

    /** Shut down Rikka entirely, don't call this or death will incur */
    private async shutdown() {
        //await this.APIManager._shutdown();
        await this.PluginManager._shutdown();
    }
}
