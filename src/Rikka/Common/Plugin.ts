/** A base class for all plugins. */
export default abstract class RikkaPlugin {
    /** The name of this plugin, shows up in the plugin list, etc. */
    readonly abstract Manifest: PluginManifest;

    enabled: boolean = false;
    ready: boolean = false;

    async _preload() {
        this.preInject();
    }

    async _load() {
        this.inject();

        this.ready = true;
    }

    /** Called in the main thread, DOM is inaccessable in the main thread. */
    preInject(): void {}

    /** Called when this plugin is being injected into the Discord client. */
    abstract inject(): void;

    async _unload() {
        this.uninject();
    }

    uninject(): void {}
}
