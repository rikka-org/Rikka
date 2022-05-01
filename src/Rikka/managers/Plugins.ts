import { readdirSync, readFileSync } from "fs";
import { join, resolve, sep } from "path";
import { NodeVM } from "vm2";
import { Logger } from "@rikka/API/Utils/logger";
import { Store } from "@rikka/API/storage";

type pluginStatus = {
    enabled: boolean;
    dateAdded: Date;
}

export default class PluginsManager {
    readonly pluginDirectory = PluginsManager.getPluginDirectory();
    private newPlugins: string[] = [];

    private virtualMachines = new Map<string, NodeVM>();

    private preferencesStore = new Store("pluginmanager");
    private pluginRegistry: { [key: string]: pluginStatus };

    constructor() {
        Logger.log(`Using plugins directory: ${this.pluginDirectory}`);
        this.preferencesStore.loadFromFile("pluginmanager.json");

        const pluginRegistry = this.preferencesStore.get("pluginRegistry");
        if (!pluginRegistry) {
            this.preferencesStore.set("pluginRegistry", {});
        }
        this.pluginRegistry = this.preferencesStore.get("pluginRegistry");
    }

    private preloadPlugin(pluginName: string) {
        try {
            const currentDir = join(this.pluginDirectory, pluginName);
            const plugin = require(currentDir).default;
            const pluginInstance = new plugin();

            if (!this.pluginRegistry[pluginName]?.enabled) return;

            if (pluginInstance.enabled) return;

            pluginInstance._preload();
        } catch (e) {
            Logger.error(`Failed to preload plugin ${pluginName}`);
        }
    }

    private loadPlugin(pluginName: string) {
        try {
            const currentDir = join(this.pluginDirectory, pluginName);
            const plugin = require(currentDir).default;
            const pluginInstance = new plugin();

            if (!this.pluginRegistry[pluginName]?.enabled) return;

            if (pluginInstance.enabled) return;

            pluginInstance._load();
        } catch (e) {
            Logger.error(`Failed to load plugin ${pluginName}.\n${e}`);
        }
    }

    private unloadPlugin(pluginName: string) {
        try {
            const currentDir = join(this.pluginDirectory, pluginName);
            const plugin = require(currentDir).default;
            const pluginInstance = new plugin();

            if (!pluginInstance) throw new Error(`Failed to unload plugin: ${pluginName}`);
            if (!pluginInstance.enabled) return;

            pluginInstance._unload();
        } catch (e) {
            Logger.error(e);
        }
    }

    enablePlugin(pluginName: string) {
        if (!this.pluginRegistry[pluginName]) throw new Error(`Plugin ${pluginName} is not registered`);

        this.pluginRegistry[pluginName]!.enabled = true;

        this.loadPlugin(pluginName);
    }

    disablePlugin(pluginName: string) {
        if (!this.pluginRegistry[pluginName]) throw new Error(`Plugin ${pluginName} is not registered`);

        this.pluginRegistry[pluginName]!.enabled = false;

        this.unloadPlugin(pluginName);
    }

    private registerPlugin(pluginName: string) {
        this.pluginRegistry[pluginName] = {
            enabled: true,
            dateAdded: new Date()
        };
    }

    private mountPlugin(pluginName: string, preload: boolean = false) {
        if (!this.pluginRegistry[pluginName]) {
            this.registerPlugin(pluginName);
        }
        else if (!this.pluginRegistry[pluginName]?.enabled) {
            return;
        }
        this.newPlugins.push(pluginName);
    }

    loadPlugins(preload: boolean = false) {
        readdirSync(this.pluginDirectory).forEach(file => this.mountPlugin(file, preload));
        this.newPlugins.forEach((plugin) => {
            try {
                if (preload) {
                    this.preloadPlugin(plugin);
                    return;
                }

                this.enablePlugin(plugin);
            } catch (e) {
                Logger.error(e);
            }
        });

        this.preferencesStore.saveToFile("pluginmanager.json");

        // Sandboxed plugins should NEVER be preloaded, as the main thread has higher permissions.
        if (preload) return;

        this.virtualMachines.forEach((vm, name) => {
            try {
                const dir = join(this.pluginDirectory, name);
                const code = readFileSync(join(dir, "index.js"), 'utf8');
                vm.run(code);
            } catch (e) {
                Logger.error(e);
            }
        });
    }

    _shutdown() {
        this.unloadPlugins();
        this.shutdownVMs();
        this.preferencesStore.saveToFile("pluginmanager.json");
    }

    private unloadPlugins() {
        this.newPlugins.forEach((plugin) => {
            this.unloadPlugin(plugin);
        });
    }

    private shutdownVMs() {
        this.virtualMachines.forEach((vm) => {
            vm.run(`process.exit(0);`);
        });
    }

    static getPluginDirectory() {
        return resolve(__dirname, '..', '..', 'plugins');
    }
}