import PCPluginsManager from "../PluginLoader";
import APIManager from "./managers/API";

export default class Powercord {
    private APIManager = new APIManager();
    pluginManager = new PCPluginsManager();


    get settings() {
        return [];
    }

}