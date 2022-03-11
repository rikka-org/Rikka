import { readdirSync } from "fs";
import { resolve } from "path";
import Plugin from "./NodeMod/entities/Plugin";

export default class PCPluginsManager {
    readonly pluginDir = PCPluginsManager.getPluginDirectory();
    plugins = new Map<string, Plugin>();

    loadPlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to load plugin: ${pluginName}`);
        if (plugin.ready) return;

        plugin._load();
    }

    enablePlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to enable plugin: ${pluginName}`);
        if (plugin.ready) return;

        plugin._load();
    }

    static getPluginDirectory() {
        return resolve(__dirname, 'plugins');
    }

    mountPlugin(pluginName: string) {
        try {
            const pluginClass = require(resolve(this.pluginDir, pluginName));
            const plugin = new pluginClass();
            console.log(`Mounting ${resolve(this.pluginDir, pluginName)}`);
            if (!pluginClass) throw new Error(`Failed to mount plugin: ${pluginName}`);

            this.plugins.set(pluginName, plugin);
            console.log("not here");
        } catch (e) {
            console.error(`Failed to mount plugin: ${pluginName}. ${e}`);
        }
    }
    
    remountPlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to remount plugin: ${pluginName}`);
        if (plugin.ready) return;

        this.mountPlugin(pluginName);
    }

    loadPlugins() {
        readdirSync(this.pluginDir).forEach(file => this.mountPlugin(file));
        this.plugins.forEach((plugin, name) => {
            try {
                this.loadPlugin(name);
            } catch (e) {
                console.error(e);
            }
        });
    }

    get(key: string) {
        return this.plugins.get(key);
    }
}