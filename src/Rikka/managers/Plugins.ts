import { readdirSync, readFileSync } from "fs";
import { join, resolve, sep } from "path";
import RikkaPlugin from "@rikka/Common/Plugin";
import { NodeVM } from "vm2";

export default class PluginsManager {
    readonly pluginDirectory = PluginsManager.getPluginDirectory();
    protected plugins = new Map<string, RikkaPlugin>();
    private virtualMachines = new Map<string, NodeVM>();

    constructor() {
        console.log(`Using plugins directory: ${this.pluginDirectory}`);
    }

    private preloadPlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to preload plugin: ${pluginName}`);
        if (plugin.enabled) return;

        plugin._preload();
    }

    private loadPlugin(pluginName: string) {
        console.log(this.plugins);
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to load plugin: ${pluginName}`);
        if (plugin.enabled) return;

        plugin._load();
    }

    private unloadPlugin(pluginName: string) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) throw new Error(`Failed to unload plugin: ${pluginName}`);
        if (!plugin.enabled) return;

        plugin._unload();
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

    private mountPlugin(pluginName: string, preload: boolean = false) {
        try {
            const currentDir = join(this.pluginDirectory, pluginName);
            const pluginManifest = (() => {
                try {
                    const manifest = require(resolve(currentDir, 'manifest.json'));
                    if (manifest) return manifest;
                } catch (e) {
                    console.log("No manifest");
                }
            })();

            if (pluginManifest && pluginManifest.sandboxed && !preload) {
                const permsNeeded = (() => {
                    const permsNeeded = pluginManifest.permissions;
                    if (permsNeeded) return permsNeeded;
                })();

                const vm = new NodeVM({
                    console: 'off',
                    sandbox: {},
                    require: {
                        external: (() => {
                            // Convert each @rikka to the directory above us
                            const external = permsNeeded.modules.map((p: string) => p.replace(/^@rikka\//, `${__dirname.replace(RegExp(sep.repeat(2), 'g'), '/')}/../`));
                            console.log(`External: ${external}`);
                            return external.modules;
                        })(),
                        root: currentDir,
                        builtin: [
                            'tslib',
                        ]
                    },
                });
                this.virtualMachines.set(pluginName, vm);
                return;
            }

            const plugin = require(currentDir);

            console.log(`Mounting ${currentDir}`);
            if (!plugin) throw new Error(`Failed to mount plugin: ${pluginName}`);

            this.plugins.set(pluginName, new plugin.default());
        } catch (e) {
            console.error(`Failed to mount plugin: ${pluginName}. ${e}`);
        }
    }

    loadPlugins(preload: boolean = false) {
        readdirSync(this.pluginDirectory).forEach(file => this.mountPlugin(file, preload));
        this.plugins.forEach((plugin, name) => {
            try {
                if (preload) {
                    this.preloadPlugin(name);
                    return;
                }

                this.loadPlugin(name);
            } catch (e) {
                console.error(e);
            }
        });

        // Sandboxed plugins should NEVER be preloaded, as the main thread has higher permissions.
        if (preload) return;

        this.virtualMachines.forEach((vm, name) => {
            try {
                const dir = join(this.pluginDirectory, name);
                const code = readFileSync(join(dir, "index.js"), 'utf8');
                vm.run(code);
            } catch (e) {
                console.error(e);
            }
        });
    }

    async _shutdown() {
        await this.unloadPlugins();
        await this.shutdownVMs();
    }

    private unloadPlugins() {
        this.plugins.forEach((plugin, name) => {
            this.unloadPlugin(name);
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