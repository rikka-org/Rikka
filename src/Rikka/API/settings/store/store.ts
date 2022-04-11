import { existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { RK_SETTINGS_CONSTANTS } from "./constants";
import { createStore, Store } from "redux";

if (!existsSync(RK_SETTINGS_CONSTANTS.STORE_LOCATION)) {
    mkdirSync(RK_SETTINGS_CONSTANTS.STORE_LOCATION);
}

function parseSettings(file: string) {
    const category = file.split('.')[0];

    try {
        return [
            file.split('.')[0],
            JSON.parse(
                readFileSync(join(RK_SETTINGS_CONSTANTS.STORE_LOCATION, file), 'utf8')
              )
        ]
    } catch(e) {
        return [ category, {} ];
    }
}

const settings = (() => {
    return readdirSync(RK_SETTINGS_CONSTANTS.STORE_LOCATION)
        .filter(f => !f.startsWith('.') && f.endsWith('.json'))
        .map(parseSettings)
})();

export class SettingsStore {
    reduxStore: any;

    constructor() {
        this.reduxStore = createStore((state: any = {}, action: any) => {
            switch (action.type) {
                case RK_SETTINGS_CONSTANTS.settings_types.SET_SETTING:
                    const [ category, key, value ] = action.payload;

                    const [ categoryName, settings ] = this.getSettings(category);

                    settings[key] = value;

                    this._writeSettings();

                    console.log("amogus");

                    return {
                        ...state,
                        [categoryName]: settings
                    };
                default:
                    return state;
            }
        });

        // Subscribe to changes
        this.reduxStore.subscribe(() => {
            this._writeSettings();
        });
    }

    /** Get every setting registered */
    getAllSettings() {
        return settings;
    }

    /** Get all settings for a certain category. */
    getSettings(category: string) {
        return settings.find(s => s[0] === category) || [ category, {} ];
    }

    /** Get a setting by its category and key */
    getSetting(category: string, key: string) {
        const [, settings ] = this.getSettings(category);

        return settings[key];
    }

    setSetting(category: string, key: string, value: any) {
        this.reduxStore.dispatch({
            type: RK_SETTINGS_CONSTANTS.settings_types.SET_SETTING,
            payload: [ category, key, value ]
        });
        
    }

    /** Write all settings to file. Plugins should NOT manually call this. */
    async _writeSettings() {
        settings.forEach(async ([ category, settings ]) => {
            await writeFile(
                join(RK_SETTINGS_CONSTANTS.STORE_LOCATION, `${category}.json`),
                JSON.stringify(settings, null, 2)
            );
        });
    }
}

export const settingsManager = new SettingsStore();