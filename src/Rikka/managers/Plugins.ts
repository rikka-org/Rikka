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
            const currentDir = join(this.pluginDirectory, pluginName);
            const pluginManifest = (() => {
                try {
                    const manifest = require(resolve(currentDir, 'manifest.json'));
                    if (manifest) return manifest;
                } catch (e) {
                    console.log("No manifest");
                }
            })();

            if (pluginManifest && pluginManifest.sandboxed) {
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
                            external.push(require.resolve('tslib'));
                            console.log(`External: ${external}`);
                            return external.modules;
                        })(),
                        root: currentDir,
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

    loadPlugins() {
        readdirSync(this.pluginDirectory).forEach(file => this.mountPlugin(file));
        this.plugins.forEach((plugin, name) => {
            try {
                this.loadPlugin(name);
            } catch (e) {
                console.error(e);
            }
        });

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

    protected shutdownVMs() {
        this.virtualMachines.forEach((vm) => {
            vm.run(`process.exit(0);`);
        });
    }

    static getPluginDirectory() {
        return resolve(__dirname, '..', '..', 'plugins');
    }
}