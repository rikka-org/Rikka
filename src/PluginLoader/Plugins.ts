import { readdir } from "fs/promises";
import { join } from "path";
import { RikkaPlugin } from "../Common/Plugin";

/** Looks for package.json's in the plugins directory, then require()'s the main module. 
 * Each plugin has its own directory and a package.json.
*/
export async function LoadPlugins() {
    const plugins = await readdir(join(__dirname, "..", "plugins"));
    for (const plugin of plugins) {
        try {
            const pluginPath = join(__dirname, "..", "plugins", plugin);
            const packageJSON = require(join(pluginPath, "package.json"));
            const pluginModule = require(join(pluginPath, packageJSON.main));
            
            const loadedPlugin: RikkaPlugin = new pluginModule.default();
            loadedPlugin.inject();
        } catch (e) {
            console.error(`Failed to load plugin ${plugin}: ${e}`);
        }
    }
}