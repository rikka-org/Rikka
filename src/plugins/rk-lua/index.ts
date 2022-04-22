import RikkaPlugin from '@rikka/Common/entities/Plugin';
import luaPluginManager from './managers/luaPluginManager';
import * as pkg from "./package.json";

export default class rkLua extends RikkaPlugin {
    Manifest = {
        name: pkg.name,
        description: pkg.description,
        author: pkg.author,
        license: pkg.license,
        version: pkg.version,
        dependencies: pkg.dependencies
    }

    private pluginManager = new luaPluginManager();

    inject() {
        
    }
}
