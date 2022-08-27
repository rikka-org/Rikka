import { SettingsCategory } from "@rikka/API/settings";
import React from "react";

export type SettingsPage = {
  category: string;
  label: string | (() => string);
  render: () => React.ReactNode;
}

/**
 * @description Public API that plugins can use to access store and retrieve their settings.
*/
export default class SettingsManager {
  settings: Map<string, SettingsCategory> = new Map();

  settingsTabs: { [key: string]: SettingsPage } = {};

  registerSetting(id: string, category: SettingsCategory) {
    this.settings.set(id, category);
  }

  registerSettings(id: string, category: SettingsPage) {
    this.settingsTabs[id] = category;
  }
}
