import { Store } from "@rikka/API/storage";
import { Logger } from "@rikka/API/Utils";
import { readFileSync } from "fs";
import Updatable from "./Updatable";

/**
 * A base class for all plugins.
*/
export default abstract class RikkaPlugin extends Updatable {
  /**
   * The name of this plugin, shows up in the plugin list, etc.
   * NOTE: This is set at runtime, so it is not recommended to change this.
  */
  Manifest?: PluginManifest;

  enabled: boolean = false;

  ready: boolean = false;

  /**
   * A settings store that automatically saves when the plugin is unloaded.
  */
  settings: Store;

  constructor() {
    super();
    this.settings = new Store(this.id);
  }

  /** Internal preload function */
  _preload() {
    this.preInject();
  }

  /** Internal loading function.
    * Overriding this runs the risk of your plugin locking up.
  */
  async _load() {
    this.inject();

    this.ready = true;
  }

  /** Called in the main thread, DOM is inaccessable in the main thread.
    * NOTE: It is YOUR responsibility to make sure that you don't block the main thread.
    * There are no protections against buggy code.
  */
  preInject(): void {}

  // Called when this plugin is being injected into the Discord client.
  protected abstract inject(): void;

  async _unload() {
    this.uninject();
    this.settings.save();
  }

  /**
   * Called when this plugin is about to be uninjected.
   * You should delete temporary files and uninject your own code here.
  */
  protected uninject(): void {}

  /**
   * Convenience function that loads a stylesheet, and keeps track of it for you.
  */
  protected loadStyleSheet(file: string) {
    const styleCode = readFileSync(file);

    const style = document.createElement("style");
    style.innerHTML = styleCode.toString();
    document.head.appendChild(style);
  }

  protected log(message: string) {
    Logger.log(`[${this.id}]: ${message}`);
  }

  protected warn(message: string) {
    Logger.warn(`[${this.id}]: ${message}`);
  }

  protected error(message: string) {
    Logger.error(`[${this.id}]: ${message}`);
  }
}
