import { dialog } from "electron";
import PluginsManager from "./managers/Plugins";
import StyleManager from "./managers/StyleManager";
import { saveToFile, Logger } from "./API/Utils/logger";
// @ts-ignore -- FluxDispatcher is added at runtime
// eslint-disable-next-line import/named
import { getAllModules, init as initWebpackModules, FluxDispatcher } from "./API/webpack";
import Updatable from "./Common/entities/Updatable";
import SettingsManager from "./managers/SettingsManager";

export default class Rikka extends Updatable {
  private styleManager = new StyleManager();

  private PluginManager = new PluginsManager();

  settingsManager = new SettingsManager();

  /** Deprecated way of accessing plugin APIs */
  // private APIManager = new APIManager();

  /** Is Rikka fully loaded? */
  private ready: boolean = false;

  constructor() {
    super();

    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", () => this.init()); } else { this.init(); }
  }

  private async handleConnectionOpen() {
    return new Promise<void>((resolve) => {
      console.log(getAllModules()?.length);
      if (getAllModules()?.length > 7000) {
        // eslint-disable-next-line no-promise-executor-return
        return resolve();
      }
      FluxDispatcher.subscribe("CONNECTION_OPEN", () => resolve());
      // resolve();
    });
  }

  private async ensureWebpackModules() {
    try {
      /**
             * Initialize the webpack modules.
             */
      await initWebpackModules();

      await this.handleConnectionOpen();
    } catch (errmsg) {
      Logger.error(`Something went wrong while initializing webpack modules: ${errmsg}`);
    }
  }

  private async init() {
    try {
      await this.ensureWebpackModules();
    } catch (e) {
      Logger.error(`Something went critically wrong with Rikka's startup function!\n${e}`);
      dialog.showMessageBox({
        title: "Rikka",
        type: "error",
        message: "Rikka has encountered a serious error and will now close. Please report this issue to the developers.",
        detail: "Rebuilding Rikka may fix this issue.",
        buttons: ["OK"],
      });
    }

    await this.start();

    this.ready = true;
  }

  private async start() {
    // Make the logs save to file every 5 seconds
    setInterval(() => {
      const logsDir = `${__dirname}`;
      saveToFile(`${logsDir}/logs.json`);
    }, 5000);

    // Setup compilers
    require("./modules/compilers");

    this.styleManager._loadThemes();
    this.styleManager._applyThemes();
    this.PluginManager.loadPlugins();

    process.on("exit", () => this.shutdown());
  }

  /** Shut down Rikka entirely, don't call this or death will incur */
  private shutdown() {
    Logger.log("Rikka is shutting down...");
    // await this.APIManager._shutdown();
    this.PluginManager._shutdown();

    Logger.log("Goodbye!");
    const logsDir = `${__dirname}`;
    saveToFile(`${logsDir}/logs.json`);
  }
}
