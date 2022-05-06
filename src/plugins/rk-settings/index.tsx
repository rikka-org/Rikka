import Rikka from "@rikka/index";
import { patch } from "@rikka/API/patcher";
import { SettingsCategory } from "@rikka/API/settings";
import { Store } from "@rikka/API/storage";
import { Logger } from "@rikka/API/Utils";
import { getModule, getModuleByDisplayName } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import manifest from "./manifest.json";

declare var rikka: Rikka;

export default class rkSettings extends RikkaPlugin {
  private settingsStore = new Store("rk-settings");
  private settingsCategory = new SettingsCategory("General", "General settings for Rikka", this.settingsStore);

  inject() {
    this.enableExperiments();
    this.patchSettingsMenu();
  }

  private async enableExperiments() {
    try {
      const experiments = (await getModule(
        (r: any) => r.isDeveloper !== void 0
      )) as any;
      Object.defineProperty(experiments, "isDeveloper", {
        get: () => true,
      });

      // Ensure components do get the update
      experiments._changeCallbacks.forEach((cb: () => any) => cb());
      Logger.warn("Experiments enabled! Be careful!");
    } catch (e) {
      Logger.error(`Failed to enable experiments: ${e}`);
    }
  }

  private async patchSettingsMenu() {
    rikka.settingsManager.registerSetting("rk-general", this.settingsCategory);
    const SettingsView = (await getModuleByDisplayName("SettingsView")) as any;
    patch(
      "rk-settings-view-mod",
      SettingsView.prototype,
      "getPredicateSections",
      (_: any, sections: any) => {
        Logger.log("mogus");

        const changelog = sections.find((c: any) => c.section === "changelog");
        // slap rikka settings right after changelog
        if (changelog) {
          sections.splice(
            sections.indexOf(changelog),
            0,
            {
              section: "HEADER",
              label: "Rikka",
            },
            ...Array.from(rikka.settingsManager.settings.values()).map((s: any) => {
              return {
                section: "rk-general",
                label: s.name,
              };
            }),
            {
              section: "DIVIDER",
            }
          );
        }
      }
    );
  }

  uninject() {
      
  }
}