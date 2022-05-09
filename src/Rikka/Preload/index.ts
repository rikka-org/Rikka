import PluginsManager from "@rikka/managers/Plugins";

export function preloadPlugins() {
  const pluginManager = new PluginsManager();

  pluginManager.loadPlugins(true);
}
