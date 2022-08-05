import { readdirSync, readFileSync } from "fs";
import { join, resolve, sep } from "path";
import { NodeVM } from "vm2";
import { Logger } from "@rikka/API/Utils/logger";
import { Store } from "@rikka/API/storage";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import Manager from "./Manager";

type pluginStatus = {
    enabled: boolean;
    dateAdded: Date;
}

/** The main plugin manager for Rikka.
 * @param pluginsDir The directory the manager should look for plugins in.
*/
export default class PluginsManager extends Manager {
  readonly pluginDirectory: string = PluginsManager.getPluginDirectory();

  private plugins: string[] = [];

  private virtualMachines = new Map<string, NodeVM>();

  private preferencesStore = new Store("pluginmanager");

  private pluginRegistry: { [key: string]: pluginStatus };

  constructor(pluginsDir?: string) {
    super();

    Logger.log(`Using plugins directory: ${this.pluginDirectory}`);
    this.preferencesStore.load();

    const pluginRegistry = this.preferencesStore.get("pluginRegistry");
    if (!pluginRegistry) {
      this.preferencesStore.set("pluginRegistry", {});
    }
    this.pluginRegistry = this.preferencesStore.get("pluginRegistry");
  }

  private loadPlugin(pluginName: string, preload: boolean = false) {
    try {
      if (!this.pluginRegistry[pluginName]?.enabled) return;

      const currentDir = join(this.pluginDirectory, pluginName);

      // Safely read the plugin's manifest directly from the filesystem.
      const manifest = JSON.parse(readFileSync(join(currentDir, "manifest.json"), "utf8"));
      if (!manifest) throw new Error(`Failed to load plugin ${pluginName}: manifest.json is missing`);
      if (preload && (!manifest.preload || manifest.sandboxed)) return;

      const Plugin = require(currentDir).default;
      const pluginInstance = new Plugin() as RikkaPlugin | undefined;
      if (!pluginInstance) throw new Error(`Failed to load plugin ${pluginName}: plugin is missing`);

      if (pluginInstance.enabled) return;

      pluginInstance.Manifest = manifest;
      if (preload) { pluginInstance._preload(); } else { pluginInstance._load(); }
    } catch (e) {
      Logger.error(`Failed to load plugin ${pluginName}.\n${e}`);
    }
  }

  private unloadPlugin(pluginName: string) {
    try {
      const currentDir = join(this.pluginDirectory, pluginName);
      const Plugin = require(currentDir).default;
      const pluginInstance = new Plugin() as RikkaPlugin | undefined;

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
      dateAdded: new Date(),
    };
  }

  private mountPlugin(pluginName: string, preload: boolean = false) {
    if (!this.pluginRegistry[pluginName]) {
      this.registerPlugin(pluginName);
    } else if (!this.pluginRegistry[pluginName]?.enabled) {
      return;
    }
    this.plugins.push(pluginName);
  }

  loadPlugins(preload: boolean = false) {
    readdirSync(this.pluginDirectory).forEach((file) => this.mountPlugin(file, preload));
    this.plugins.forEach((plugin) => {
      try {
        this.loadPlugin(plugin, preload);
      } catch (e) {
        Logger.error(e);
      }
    });

    this.preferencesStore.save();

    // Sandboxed plugins should NEVER be preloaded, as the main thread has higher permissions.
    if (preload) return;

    this.virtualMachines.forEach((vm, name) => {
      try {
        const dir = join(this.pluginDirectory, name);
        const code = readFileSync(join(dir, "index.js"), "utf8");
        vm.run(code);
      } catch (e) {
        Logger.error(e);
      }
    });
  }

  _shutdown() {
    super.shutdown();

    this.preferencesStore.save();
    this.unloadPlugins();
    this.shutdownVMs();
  }

  private unloadPlugins() {
    this.plugins.forEach((plugin) => {
      this.unloadPlugin(plugin);
    });
  }

  private shutdownVMs() {
    this.virtualMachines.forEach((vm) => {
      vm.run(`process.exit(0);`);
    });
  }

  static getPluginDirectory() {
    return resolve(__dirname, "..", "..", "plugins");
  }
}
