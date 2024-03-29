import { ipcRenderer } from "electron";
import PluginsManager from "./managers/Plugins";
import StyleManager from "./managers/StyleManager";
import { saveToFile } from "./API/Utils/logger";
import { getAllModules, init as initWebpackModules, FluxDispatcher } from "./API/webpack";
import Updatable from "./Common/entities/Updatable";
import SettingsManager from "./managers/SettingsManager";
import { IPC_Consts } from "./API/Constants";
import { APIManager } from "./managers/APIManager";
import { RKApiTypings } from "./RKApi/apiTypings";
import * as coremods from "./modules/coremods";
import { RikkaNative } from "./IPC/renderer";

export default class Rikka extends Updatable {
  styleManager = new StyleManager();

  PluginManager = new PluginsManager();

  settingsManager = new SettingsManager();

  apiManager = new APIManager();

  api: RKApiTypings = {} as RKApiTypings;

  /** Is Rikka fully loaded? */
  private ready: boolean = false;

  constructor() {
    super();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  private async handleConnectionOpen() {
    return new Promise<void>((resolve) => {
      // eslint-disable-next-line no-console
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
    await initWebpackModules();

    await this.handleConnectionOpen();
  }

  private async init() {
    try {
      await this.ensureWebpackModules();
    } catch (e) {
      this.error(`Something went critically wrong with Rikka's startup function!\n${e}`);
      RikkaNative.showDialog(({
        title: "Rikka",
        type: "error",
        message: "Rikka has encountered a serious error and will now close. Please report this issue to the developers.",
        detail: "Rebuilding Rikka may fix this issue.",
        buttons: ["OK"],
      }));
    }

    this.start();

    this.ready = true;
  }

  private start() {
    // Make the logs save to file every 5 seconds
    setInterval(() => {
      const logsDir = `${__dirname}`;
      saveToFile(`${logsDir}/logs.json`);
    }, 5000);

    // Setup compilers
    require("./modules/compilers");

    this.apiManager.init();

    coremods.load();

    this.styleManager._loadThemes();
    this.styleManager._applyThemes();
    this.PluginManager.loadPlugins();

    process.on("exit", () => this.shutdown());
  }

  /** Shut down Rikka entirely, don't call this or death will incur */
  private shutdown() {
    this.log("Rikka is shutting down...");

    this.PluginManager.shutdown();
    this.styleManager.shutdown();
    this.apiManager.unload();

    this.log("Goodbye!");
    const logsDir = `${__dirname}`;
    saveToFile(`${logsDir}/logs.json`);
  }
}
