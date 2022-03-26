const { FluxDispatcher } = require('powercord/webpack');
import ActionTypes from "./constants";

export function toggleSetting(category: string, setting: any, defaultValue?: any) {
    FluxDispatcher.dispatch({
        type: ActionTypes.TOGGLE_SETTING,
        category,
        setting,
        defaultValue
    });
}

export function updateSettings(category: string, settings: any) {
    FluxDispatcher.dispatch({
        type: ActionTypes.UPDATE_SETTINGS,
        category,
        settings
    });
}

export function updateSetting(category: string, setting: any, value: any) {
    FluxDispatcher.dispatch({
        type: ActionTypes.UPDATE_SETTING,
        category,
        setting,
        value
    });
}

export function deleteSetting(category: string, setting: any) {
    FluxDispatcher.dispatch({
        type: ActionTypes.DELETE_SETTING,
        category,
        setting
    });
}
