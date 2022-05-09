import { SettingsCategory } from "@rikka/API/settings";

/**
 * @description Public API that plugins can use to access store and retrieve their settings.
*/
export default class SettingsManager {
  /** Registry of all settings */
  settings: Map<string, SettingsCategory> = new Map();

  registerSetting(id: string, category: SettingsCategory) {
    this.settings.set(id, category);
  }
}
