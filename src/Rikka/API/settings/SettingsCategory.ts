import { Store } from "../storage";
import Setting from "./Setting";

export default class SettingsCategory {
    /** Rendered by the Settings visualizer as the name of the plugin. */
    name: string;
    /** Rendered by the Settings visualizer as the description of the plugin. */
    description: string;

    settings: Map<string, Setting> = new Map();
    settingsStore: Store;

    constructor(name: string, description: string, settingsStore: Store) {
        this.name = name;
        this.description = description;

        this.settingsStore = settingsStore;
        const settings = this.settingsStore.get(name);

        if (settings) {
            this.settings = settings;
        }

        this.settingsStore.set(name, this.settings);
    }

    addSetting(setting: Setting) {
        this.settings.set(setting.name, setting);
    }

    // 
    updateSetting(setting: Setting) {
        this.settings.set(setting.name, setting);
    }


}