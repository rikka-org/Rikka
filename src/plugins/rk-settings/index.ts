import { patch } from "@rikka/API/patcher";
import { Logger } from "@rikka/API/Utils";
import { getModule } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import manifest from "./manifest.json";

export default class rkSettings extends RikkaPlugin {
    inject() {

    }

    async patchSettingsMenu() {
        const SettingsContextMenu = await getModule((m: any) => m.default?.displayName === 'UserSettingsCogContextMenu');
        patch("rk-settings-menu", SettingsContextMenu, "default", (_: any, res: any) => {
            Logger.log("Injecting settings menu");
        });
    }
}
