import { Store } from "../storage";
import Setting from "./Setting";

type settingsEvents = "change" | "add" | "remove";

type settingsListener = (eventType: settingsEvents, setting: Setting, value: any) => void;

export default class SettingsCategory {
    /** Rendered by the Settings visualizer as the name of the plugin. */
    name: string;
    /** Rendered by the Settings visualizer as the description of the plugin. */
    description: string;

    settings: Map<string, Setting> = new Map();
    settingsStore: Store;

    private listeners: Map<settingsEvents, settingsListener> = new Map();

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

        this.listeners.forEach((listener, eventType) => {
            if (eventType !== "add") return;
            listener(eventType, setting, setting.value);
        });
    }

    // 
    updateSetting(name: string, value: any) {
        const setting = this.settings.get(name);
        if (!setting) return;

        setting.value = value;
        
        this.listeners.forEach((listener, eventType) => {
            if (eventType !== "change") return;
            listener(eventType, setting, value);
        });
    }

    removeSetting(name: string) {
        this.settings.delete(name);
    }

    getSetting(name: string) {
        return this.settings.get(name);
    }

    listen(eventType: settingsEvents, listener: settingsListener) {
        this.listeners.set(eventType, listener);
    }
}