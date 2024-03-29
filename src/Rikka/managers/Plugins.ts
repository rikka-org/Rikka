import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { Logger } from "@rikka/API/Utils/logger";
import { Store } from "@rikka/API/storage";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { Nullable } from "@rikka/API/typings";
import { getCompiler } from "@rikka/modules/compilers";
import Manager from "./Manager";

type pluginStatus = {
  enabled: boolean;
  dateAdded: Date;
}

type registry = { [key: string]: pluginStatus }

/**
 * The main plugin manager for Rikka.
 * @param preload Whether to put the plugins in preload mode.
*/
export default class PluginsManager extends Manager {
  readonly pluginDirectory = join(__dirname, "../../plugins");

  /**
   * A map of plugin instances by name.
  */
  pluginInstances: Map<string, RikkaPlugin> = new Map();

  private preferencesStore = new Store<registry>("pluginmanager");

  pluginRegistry: registry;

  private preload: boolean;

  constructor(preload = false) {
    super();

    this.preload = preload;

    Logger.log(`Using plugins directory: ${this.pluginDirectory}`);
    this.preferencesStore.load();

    this.pluginRegistry = this.preferencesStore.get("pluginRegistry", {});
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
      if (!manifest) throw new Error(`Failed to load plugin ${pluginName}: manifest.json is missing`);

      if (!this.pluginRegistry[pluginName]?.enabled) return;

      if (this.preload && (!manifest.preload)) return;

      const Plugin = require(currentDir).default;
      const pluginInstance = new Plugin() as Nullable<RikkaPlugin>;
      if (!pluginInstance) throw new Error(`Failed to load plugin ${pluginName}: plugin is missing`);

      if (pluginInstance.enabled) return;

      pluginInstance.Manifest = manifest;
      pluginInstance.path = currentDir;
      this.pluginInstances.set(pluginName, pluginInstance);
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

  private mount(pluginName: string) {
    if (!this.pluginRegistry[pluginName]) {
      this.registerPlugin(pluginName);
    }
  }

  isInstalled(id: string) {
    return this.pluginInstances.has(id);
  }

  loadPlugins() {
    readdirSync(this.pluginDirectory)
      .filter((file) => !file.startsWith("."))
      .forEach((file) => {
        this.mount(file);
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
}
