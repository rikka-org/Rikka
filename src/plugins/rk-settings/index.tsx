import { patch } from "@rikka/API/patcher";
import { Logger } from "@rikka/API/Utils";
import { getModule, getModuleByDisplayName } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { Test } from "./components/Test";
import manifest from "./manifest.json";

export default class rkSettings extends RikkaPlugin {
  inject() {
    this.patchSettingsMenu();
  }

  patchSettingsMenu() {
    const SettingsView = getModuleByDisplayName("SettingsView") as any;
    patch(
      "rk-settings-view-mod",
      SettingsView.prototype,
      "getPredicateSections",
      (_: any, sections: any) => {
        Logger.log("mogus");

        sections.props.children.push(
          <>
            <Test />
          </>
        );
      }
    );
  }
}
