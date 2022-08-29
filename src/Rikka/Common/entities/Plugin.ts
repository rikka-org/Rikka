import { Store } from "@rikka/API/storage";
import { createElement } from "@rikka/API/Utils/DOM";
import { getCompiler } from "@rikka/modules/compilers";
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

    this.settings = new Store(this.id, {
      autoSave: true,
    });

    this.settings.load();
  }

  /**
   * Sets up some internal logic that shouldn't be screwed with.
   */
  private sharedInject() {
    this.enabled = true;
  }

  private sharedUninject() {
    this.enabled = false;
  }

  /** Internal preload function */
  _preload() {
    this.sharedInject();
    this.preInject();
  }

  /** Internal loading function.
    * Overriding this runs the risk of your plugin locking up.
  */
  async _load() {
    this.sharedInject();
    this.inject();

    this.ready = true;
  }

  /**
    * Called in the main thread, DOM is inaccessable in the main thread.
    * NOTE: It is YOUR responsibility to make sure that you don't block the main thread.
    * There are no protections against buggy code. You may also need to dynamically
    * require() modules incase you require a module that needs access to main stuff.
  */
  preInject(): void {}

  /**
   * The startup function of this plugin.
   */
  protected abstract inject(): void;

  async _unload() {
    this.sharedUninject();
    this.uninject();
    this.settings.save();
  }

  /**
   * Called when this plugin is about to be uninjected.
   * You should cleanup any resources here, and unpatch any patches you made.
  */
  protected uninject(): void {}

  /**
   * Convenience function that loads a stylesheet, and keeps track of it for you.
  */
  protected loadStyleSheet(file: string) {
    const CompilerModule = getCompiler(file);
    const compiler = new CompilerModule(file);
    const styleCode = compiler.doCompilation();

    const id = Math.random().toString(36).slice(2);
    const style = createElement("style", {
      id: `style-rkplugin-${id}`,
      "data-rk": true,
      "data-rkplugin": true,
    });

    document.head.appendChild(style);
    style.innerHTML = styleCode;
    return id;
  }
}
