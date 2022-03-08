import PluginsManager from "./managers/Plugins";
import StyleManager from "./managers/StyleManager";

export default class Rikka {
    private styleManager = new StyleManager();
    private PluginManager = new PluginsManager();

    constructor() {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', () => this.start());
        else
            this.start();
    }

    private async start() {
        this.rikkaStartup();
        this.PluginManager.loadPlugins();
    }

    private async rikkaStartup() {
        this.styleManager.loadThemes();
    }
}
