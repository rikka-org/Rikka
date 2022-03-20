import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import constants from "../../../NodeMod/powercord/constants";
import ActionTypes from "./constants";
const { Flux, FluxDispatcher } = require('powercord/webpack');

if (!existsSync(constants.SETTINGS_FOLDER))
    mkdirSync(constants.SETTINGS_FOLDER);

function loadSettings(file: string) {
    const categoryId = file.split('.')[0];

    try {
        return [
            file.split('.')[0],
            JSON.parse(
                readFileSync(join(constants.SETTINGS_FOLDER, file), 'utf8')
            )
        ];
    } catch (e) {
        // Maybe corrupted settings; Let's consider them empty
        return [categoryId, {}];
    }
}

const settings = Object.fromEntries(
    readdirSync(constants.SETTINGS_FOLDER)
        .filter(f => !f.startsWith('.') && f.endsWith('.json'))
        .map(loadSettings)
);

function updateSettings(category: string | number, newSettings: any) {
    if (!settings[category]) {
        settings[category] = {};
    }
    Object.assign(settings[category], newSettings);
}

function updateSetting(category: string, setting: string, value: undefined) {
    if (!settings[category]) {
        settings[category] = {};
    }
    if (value === void 0) {
        delete settings[category][setting];
    } else {
        settings[category][setting] = value;
    }
}

function toggleSetting(category: string, setting: string, defaultValue: any) {
    if (!settings[category]) {
        settings[category] = {};
    }
    const previous = settings[category][setting];
    if (previous === void 0) {
        settings[category][setting] = !defaultValue;
    } else {
        settings[category][setting] = !previous;
    }
}

function deleteSetting(category: string, setting: string) {
    if (!settings[category]) {
        settings[category] = {};
    }
    delete settings[category][setting];
}

class SettingsStore extends Flux.Store {
    constructor(Dispatcher: any, handlers: any) {
        super(Dispatcher, handlers);

        this._persist = global._.debounce(this._persist.bind(this), 1000);
        this.addChangeListener(this._persist);
    }

    getAllSettings() {
        return settings;
    }

    getSettings(category: string) {
        return settings[category] || {};
    }

    getSetting(category: string, nodePath: string, defaultValue: any) {
        const nodePaths = nodePath.split('.');
        let currentNode = this.getSettings(category);

        for (const fragment of nodePaths) {
            currentNode = currentNode[fragment];
        }

        return (currentNode === void 0 || currentNode === null)
            ? defaultValue
            : currentNode;
    }

    getSettingsKeys(category: string) {
        return Object.keys(this.getSettings(category));
    }

    _persist() {
        for (const category in settings) {
            const file = join(constants.SETTINGS_FOLDER, `${category}.json`);
            const data = JSON.stringify(settings[category], null, 2);
            writeFileSync(file, data);
        }
    }
}


export = new SettingsStore(FluxDispatcher, {
    // @ts-ignore
    [ActionTypes.UPDATE_SETTINGS]: ({ category, settings }) => updateSettings(category, settings),
    // @ts-ignore
    [ActionTypes.TOGGLE_SETTING]: ({ category, setting, defaultValue }) => toggleSetting(category, setting, defaultValue),
    // @ts-ignore
    [ActionTypes.UPDATE_SETTING]: ({ category, setting, value }) => updateSetting(category, setting, value),
    // @ts-ignore
    [ActionTypes.DELETE_SETTING]: ({ category, setting }) => deleteSetting(category, setting)
});