import { patch } from "@rikka/API/patcher";
import { Logger } from "@rikka/API/Utils";
import { getModule, getModuleByDisplayName } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { Test } from "./components/Test";
import manifest from "./manifest.json";

export default class rkSettings extends RikkaPlugin {
  inject() {
    this.enableExperiments();
    this.patchSettingsMenu();
  }

  async enableExperiments() {
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

  async patchSettingsMenu() {
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
            {
              section: "DIVIDER",
            }
          );
        }
      }
    );
  }
}
