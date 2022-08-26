import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { join } from "path";
import React from "react";
import { Plugins } from "./components/managers/Plugins";
import { Themes } from "./components/managers/Themes";
import manifest from "./manifest.json";

export default class RkManager extends RikkaPlugin {
  inject() {
    this.loadStyleSheet(join(__dirname, "style.css"));
    this.loadStyleSheet(join(__dirname, "scss/style.scss"));

    $rk.settingsManager.registerSettings("rk-manager-plugins", {
      category: "moduleManager",
      label: "Plugins",
      render: () => React.createElement(Plugins),
    });
    $rk.settingsManager.registerSettings("rk-manager-themes", {
      category: "moduleManager",
      label: "Themes",
      render: () => React.createElement(Themes),
    });
  }
}
