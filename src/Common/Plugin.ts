/** A base class for all plugins. */
export abstract class RikkaPlugin {
    /** The name of this plugin, shows up in the plugin list, etc. */
    readonly abstract name: string;
    readonly abstract description: string;
    readonly abstract author: string;

    enabled: boolean = false;
    
    /** Called when this plugin is being injected into the Discord client. */
    abstract inject(): void;

    discordReady() {
        console.log(`${this.name} is ready!`);
    }

    unload() {
        this.enabled = false;
    }
}
