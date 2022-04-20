import { readdirSync } from "fs";
import { join, resolve } from "path";
import Plugin from "../../NodeMod/powercord/entities/Plugin";

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
        return resolve(join(__dirname, '..', '..'), 'plugins');
    }

    mountPlugin(pluginName: string) {
        try {
            const pluginClass = require(resolve(this.pluginDir, pluginName));
            pluginClass.entityID = pluginName;
            const plugin = new pluginClass();
            Object.defineProperties(plugin, {
                entityID: {
                    get: () => pluginName,
                    set: () => {
                        throw new Error('Cannot set entityID');
                    }
                }
            })
            console.log(`Mounting ${resolve(this.pluginDir, pluginName)}`);
            if (!pluginClass) throw new Error(`Failed to mount plugin: ${pluginName}`);

            this.plugins.set(pluginName, plugin);
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