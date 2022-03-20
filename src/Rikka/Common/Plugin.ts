/** A base class for all plugins. */
export default abstract class RikkaPlugin {
    /** The name of this plugin, shows up in the plugin list, etc. */
    readonly abstract Manifest: PluginManifest;

    enabled: boolean = false;
    
    /** Called during preloadsplash */
    preload(): void {}
    /** Called when this plugin is being injected into the Discord client. */
    abstract inject(): void;

    unload(): void {}
}
