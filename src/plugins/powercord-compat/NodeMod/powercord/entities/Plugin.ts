import PCPluginsManager from "../../../PluginLoader";
import Updatable from "./Updatable";

export default class Plugin extends Updatable {
    ready = false;
    styles: any;

    constructor() {
        super(PCPluginsManager.getPluginDirectory());
    }

    async _unload () {
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

    async pluginWillUnload() {

    }

    _load() {
        this.startPlugin();
    }

    startPlugin() {
        
    }
}

module.exports = Plugin;
