import { readdirSync } from "fs";
import { resolve } from "path";
import { RikkaPlugin } from "../../Common/Plugin";

export default class PluginsManager {
    readonly pluginDirectory = PluginsManager.getPluginDirectory();
    protected plugins = new Map<string, RikkaPlugin>();

    constructor() {
        console.log(`Using plugins directory: ${this.pluginDirectory}`);
    }

    protected loadPlugin(pluginName: string) {
        console.log(this.plugins);
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to load plugin: ${pluginName}`);
        if (plugin.enabled) return;

        plugin.inject();
    }

    protected unloadPlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to unload plugin: ${pluginName}`);
        if (!plugin.enabled) return;

        plugin.unload();
    }

    enablePlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to enable plugin: ${pluginName}`);

        this.loadPlugin(pluginName);
    }

    disablePlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to disable plugin: ${pluginName}`);

        this.unloadPlugin(pluginName);
    }

    mountPlugin(pluginName: string) {
        try {
            const plugin = require(resolve(this.pluginDirectory, pluginName));
            console.log(`Mounting ${resolve(this.pluginDirectory, pluginName)}`);
            if (!plugin) throw new Error(`Failed to mount plugin: ${pluginName}`);

            this.plugins.set(pluginName, new plugin.default());
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

    static getPluginDirectory() {
        return resolve(__dirname, '..', '..', 'plugins');
    }
}