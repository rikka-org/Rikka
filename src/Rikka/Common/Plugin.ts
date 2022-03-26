/** A base class for all plugins. */
export default abstract class RikkaPlugin {
    /** The name of this plugin, shows up in the plugin list, etc. */
    readonly abstract Manifest: PluginManifest;

    enabled: boolean = false;
    ready: boolean = false;

    /** Internal loading function, plugins aren't supposed to use this. */
    async _load() {
        this.inject();

        this.ready = true;
    }

    /** Called during preloadsplash */
    preload(): void {}
    /** Called when this plugin is being injected into the Discord client. */
    abstract inject(): void;

    async _unload() {
        this.uninject();
    }

    uninject(): void {}
}
