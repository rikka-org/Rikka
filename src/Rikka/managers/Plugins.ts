import { readdirSync, readFileSync, statSync } from "fs";
import { join, resolve, sep } from "path";
import { Logger } from "@rikka/API/Utils/logger";
import { Store } from "@rikka/API/storage";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { Nullable } from "@rikka/API/typings";
import { rikkaManifest } from "@rikka/Common/entities/Theme/typings/manifestTypes";
import Manager from "./Manager";

type pluginStatus = {
    enabled: boolean;
    dateAdded: Date;
}

/**
 * The main plugin manager for Rikka.
 * @param preload Whether to put the plugins in preload mode.
*/
export default class PluginsManager extends Manager {
  readonly pluginDirectory: string = PluginsManager.getPluginDirectory();

  private plugins: PluginManifest[] = [];

  /**
   * A map of plugin instances by name.
  */
  private pluginInstances: Map<string, RikkaPlugin> = new Map();

  private preferencesStore = new Store("pluginmanager");

  private pluginRegistry: { [key: string]: pluginStatus };

  private preload: boolean;

  constructor(preload = false) {
    super();

    this.preload = preload;

    Logger.log(`Using plugins directory: ${this.pluginDirectory}`);
    this.preferencesStore.load();

    const pluginRegistry = this.preferencesStore.get("pluginRegistry");
    if (!pluginRegistry) {
      this.preferencesStore.set("pluginRegistry", {});
    }
    this.pluginRegistry = this.preferencesStore.get("pluginRegistry");
  }

  /**
   * @param pluginName The name of the plugin to load - must be the name of the directory.
   */
  private loadPlugin(pluginName: string) {
    try {
      const currentDir = join(this.pluginDirectory, pluginName);

      if (!statSync(currentDir).isDirectory()) {
        throw new Error(`${currentDir} is not a directory.`);
      }

      const manifest = JSON.parse(readFileSync(join(currentDir, "manifest.json"), "utf8")) as PluginManifest;
      if (!manifest || !manifest.name) throw new Error(`Failed to load plugin ${pluginName}: manifest.json is missing`);

      if (!this.pluginRegistry[manifest.name]?.enabled) return;

      if (this.preload && (!manifest.preload)) return;

      const Plugin = require(currentDir).default;
      const pluginInstance = new Plugin() as Nullable<RikkaPlugin>;
      if (!pluginInstance) throw new Error(`Failed to load plugin ${pluginName}: plugin is missing`);

      if (pluginInstance.enabled) return;

      pluginInstance.Manifest = manifest;
      this.pluginInstances.set(manifest.name, pluginInstance);
      if (this.preload) {
        pluginInstance._preload();
      } else {
        pluginInstance._load();
      }
    } catch (e) {
      Logger.error(`Failed to load plugin ${pluginName}.\n${e}`);
    }
  }

  private unloadPlugin(plugin: RikkaPlugin) {
    try {
      plugin._unload();
      this.pluginInstances.delete(plugin.Manifest!.name);
    } catch (e) {
      Logger.error(e);
    }
  }

  private unloadPluginByName(pluginName: string) {
    try {
      const pluginInstance = this.pluginInstances.get(pluginName);

      if (!pluginInstance) throw new Error(`Failed to unload plugin: ${pluginName}`);
      if (!pluginInstance.enabled) throw new Error(`Plugin ${pluginName} is not enabled`);

      this.unloadPlugin(pluginInstance);
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

    this.unloadPluginByName(pluginName);
  }

  private registerPlugin(pluginName: string) {
    this.pluginRegistry[pluginName] = {
      enabled: true,
      dateAdded: new Date(),
    };
  }

  private mountPlugin(pluginName: string) {
    const currentDir = join(this.pluginDirectory, pluginName);
    if (!statSync(currentDir).isDirectory()) {
      Logger.warn(`${pluginName} is not a directory`);
      return;
    }

    const manifest = JSON.parse(readFileSync(join(currentDir, "manifest.json"), "utf8")) as PluginManifest;
    if (!manifest || !manifest.name) {
      Logger.warn(`${pluginName} has an invalid manifest`);
      return;
    }

    if (!this.pluginRegistry[manifest.name]) {
      this.registerPlugin(manifest.name);
    }
    this.plugins.push(manifest);
  }

  loadPlugins() {
    readdirSync(this.pluginDirectory).forEach((file) => {
      this.mountPlugin(file);
      this.loadPlugin(file);
    });

    this.preferencesStore.save();
  }

  shutdown() {
    super.shutdown();

    this.preferencesStore.save();
    this.unloadPlugins();
  }

  private unloadPlugins() {
    this.pluginInstances.forEach((plugin) => {
      this.unloadPlugin(plugin);
    });
  }

  static getPluginDirectory() {
    return resolve(__dirname, "..", "..", "plugins");
  }
}
