const { Flux } = require('powercord/webpack');
import API from "../../NodeMod/powercord/entities/API";

import store from "./settingsStore/store";
import * as actions from "./settingsStore/actions";

import Logger from "../../Common/Logger";

export = class SettingsAPI extends API {
    store = store;
    private tabs: { [key: string]: any } = {};
    private _interval: NodeJS.Timer;

    constructor() {
        super();
        setTimeout(this.download.bind(this), 1500);
        this._interval = setInterval(this.upload.bind(this), 10 * 60 * 1000);
    }

    registerSettings(tabId: string | number, props: { category: any; render: any; }) {
        Logger.trace(`Creating settings tab ${tabId}`);
        if (this.tabs[tabId]) {
            throw new Error(`Settings tab ${tabId} is already registered!`);
        }

        this.tabs[tabId] = props;
        this.tabs[tabId].render = this.connectStores(props.category)(props.render);
        Object.freeze(this.tabs[tabId].render.prototype);
        Object.freeze(this.tabs[tabId]);
    }

    unregisterSettings(tabId: string) {
        if (this.tabs[tabId])
            delete this.tabs[tabId];
    }

    buildCategoryObject(category: string) {
        return {
            connectStore: (component: any) => this.connectStores(category)(component),
            getKeys: () => store.getSettingsKeys(category),
            get: (setting: string, defaultValue: any) => store.getSetting(category, setting, defaultValue),
            set: (setting: any, newValue: undefined) => {
                if (newValue === void 0) {
                    return actions.toggleSetting(category, setting);
                }
                actions.updateSetting(category, setting, newValue);
            },
            delete: (setting: any) => {
                actions.deleteSetting(category, setting);
            }
        };
    }

    connectStores(category: string) {
        return Flux.connectStores([this.store], () => this._fluxProps(category));
    }

    _fluxProps(category: string) {
        return {
            settings: store.getSettings(category),
            getSetting: (setting: string, defaultValue: any) => store.getSetting(category, setting, defaultValue),
            updateSetting: (setting: string, value: any) => actions.updateSetting(category, setting, value),
            toggleSetting: (setting: string, defaultValue: any) => actions.toggleSetting(category, setting, defaultValue)
        };
    }

    async startAPI() {
        // defer download a bit
        setTimeout(this.download.bind(this), 1500);
        this._interval = setInterval(this.upload.bind(this), 10 * 60 * 1000);
    }

    async apiWillUnload() {
        clearInterval(this._interval);
        await this.upload();
    }

    async upload() {
        Logger.trace(`What is this even for?`);
        return false;
    }

    async download() {
        Logger.trace(`What is this even for?`);
        return false;
    }
}
