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
        this.testDomMod();
        this.PluginManager.loadPlugins();
    }

    private testDomMod() {
        console.log("Testing dom mod");
        const node = document.createElement("div");
        node.innerHTML = "Hello world";
        document.body.appendChild(node);
    }

    private async rikkaStartup() {
        this.styleManager.loadThemes();
    }
}
