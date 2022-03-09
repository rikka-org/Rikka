import { readdirSync } from "fs";
import { resolve } from "path";
import PluginsManager from "../../Rikka/managers/Plugins";
import Plugin from "./NodeMod/powercord/entities/Plugin";

export default class PCPluginsManager {
    readonly pluginDirectory = PCPluginsManager.getPluginDirectory();
    plugins = new Map<string, Plugin>();

    loadPlugin(pluginName: string) {
        console.log(this.pluginDirectory);
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to load plugin: ${pluginName}`);
        if (plugin.ready) return;

        plugin._load();
        plugin.startPlugin();
    }

    enablePlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to enable plugin: ${pluginName}`);
        if (plugin.ready) return;

        plugin.startPlugin();
    }

    static getPluginDirectory() {
        return resolve(__dirname, "plugins");
    }

    mountPlugin(pluginName: string) {
        try {
            const plugin = require(resolve(this.pluginDirectory, pluginName));
            console.log(`Mounting ${resolve(this.pluginDirectory, pluginName)}`);
            if (!plugin) throw new Error(`Failed to mount plugin: ${pluginName}`);

            this.plugins.set(pluginName, new plugin());
        } catch (e) {
            console.error(`Failed to mount plugin: ${pluginName}. ${e}`);
        }
    }

    loadPlugins() {
        readdirSync(this.pluginDirectory).forEach(file => this.mountPlugin(file));
        this.plugins.forEach((plugin, name) => {
            try {
                this.loadPlugin(name);
            } catch (e) {
                console.error(e);
            }
        });
    }
}