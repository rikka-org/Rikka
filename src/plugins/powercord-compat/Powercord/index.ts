import PCPluginsManager from "../PluginLoader";
import APIManager from "./managers/API";

export default class Powercord {
    private APIManager = new APIManager();

    get settings() {
        return [];
    }

    pluginManager = new PCPluginsManager();
}