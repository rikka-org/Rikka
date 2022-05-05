import Setting from "./setting";

export default class settingsCategory {
    name: string;
    description: string;
    settings: Map<string, Setting> = new Map();

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    addSetting(setting: Setting) {
        this.settings.set(setting.name, setting);
    }
}