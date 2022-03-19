import { existsSync } from "fs";
import { join } from "path";
import { resolveCompiler } from "../../../powercord-git/src/fake_node_modules/powercord/compilers";
import { createElement } from "../../../powercord-git/src/fake_node_modules/powercord/util";
import PCPluginsManager from "../../../Powercord/managers/PluginLoader";
import Updatable from "./Updatable";

export default class Plugin extends Updatable {
    ready = false;
    styles: any = {};

    constructor() {
        super(PCPluginsManager.getPluginDirectory());
    }

    async _unload() {
        try {
            for (const id in this.styles) {
                this.styles[id].compiler.on('src-update', this.styles[id].compile);
                this.styles[id].compiler.disableWatcher();
                document.getElementById(`style-${this.entityID}-${id}`)?.remove();
            }

            this.styles = {};
            if (typeof this.pluginWillUnload === 'function') {
                await this.pluginWillUnload();
            }
        } catch (e) {
            console.error('An error occurred during shutting down! It\'s heavily recommended reloading Discord to ensure there are no conflicts.', e);
        } finally {
            this.ready = false;
        }
    }

    loadStylesheet(path: string) {
        let resolvedPath = path;

        if (!existsSync(resolvedPath)) {
            // Assume it's a relative path and try resolving it
            resolvedPath = join(powercord.pluginManager.pluginDir, this.entityID!, path);
            console.log(resolvedPath);

            if (!existsSync(resolvedPath)) {
                throw new Error(`Cannot find "${path}"! Make sure the file exists and try again.`);
            }
        }

        const id = Math.random().toString(36).slice(2);
        const compiler = resolveCompiler(resolvedPath);
        const style = createElement('style', {
            id: `style-${this.entityID}-${id}`,
            'data-powercord': true,
            'data-plugin': true
        });

        document.head.appendChild(style);
        const compile = async () => (style.innerHTML = await compiler?.compile());
        this.styles[id] = {
            compiler,
            compile
        };

        compiler?.enableWatcher();
        compiler?.on('src-update', compile);
        return compile();
    }

    async pluginWillUnload() {

    }

    _load() {
        this.startPlugin();
    }

    startPlugin() {

    }
}

module.exports = Plugin;
