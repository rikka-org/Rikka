/** A base class for all plugins. 
 * 
*/
export abstract class RikkaPlugin {
    /** The name of this plugin, shows up in the plugin list, etc. */
    public abstract name: string;
    public abstract description: string;

    public abstract author: string;
    
    /** Called when this plugin is being injected into the Discord client. */
    public abstract inject(): void;

    public discordReady() {
        console.log(`${this.name} is ready!`);
    }

    /** Called when this plugin is being unloaded */
    public unload() {}

    /** Called to install this plugin. */
    public install() {
        console.log(`${this.name} is installing...`);
    }

    /** Called when this plugin is being uninstalled.
     * Make sure to remove junk files and folders from the install directory.
     */
    public uninstall() {}

    /** Called when this plugin is being updated. */
    public update() {
        console.log(`${this.name} is updating...`);
        // Reload the plugin.
        this.unload();
        this.inject();
    }
}
