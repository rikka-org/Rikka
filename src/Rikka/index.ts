import PluginsManager from "./managers/Plugins";
import StyleManager from "./managers/StyleManager";
import { saveToFile } from "./API/Utils/logger";
// @ts-ignore -- FluxDispatcher is added at runtime
import { getAllModules, initialize as initWebpackModules, FluxDispatcher } from "./API/webpack";
import { Logger } from "./API/Utils/logger";

export default class Rikka {
    private styleManager = new StyleManager();
    private PluginManager = new PluginsManager();

    /** Deprecated way of accessing plugin APIs */
    //private APIManager = new APIManager();

    /** Is Rikka fully loaded? */
    private ready: boolean = false;

    constructor() {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', () => this.init());
        else
            this.init();
    }

    private async handleConnectionOpen() {
        return new Promise<void>(resolve => {
            console.log(getAllModules()?.length);
            if (getAllModules()?.length > 7000) {
                return resolve();
            }
            FluxDispatcher.subscribe('CONNECTION_OPEN', () => resolve());
            //resolve();
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
        }

        await this.start();

        this.ready = true;
    }

    private async start() {
        // Make the logs save to file every 5 seconds
        setInterval(() => {
            const logsDir = `${__dirname}`;
            saveToFile(`${logsDir}/logs.txt`);
        }, 5000);

        // Setup compilers
        require("./modules/compilers");

        this.styleManager.applyThemes();
        this.PluginManager.loadPlugins();
    }

    /** Shut down Rikka entirely, don't call this or death will incur */
    private async shutdown() {
        //await this.APIManager._shutdown();
        await this.PluginManager._shutdown();
    }
}
