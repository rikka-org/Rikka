/** A base class for all plugins. */
export abstract class RikkaPlugin {
    /** The name of this plugin, shows up in the plugin list, etc. */
    abstract name: string;
    abstract description: string;

    abstract author: string;
    
    /** Called when this plugin is being injected into the Discord client. */
    abstract inject(): void;

    discordReady() {
        console.log(`${this.name} is ready!`);
    }
}
