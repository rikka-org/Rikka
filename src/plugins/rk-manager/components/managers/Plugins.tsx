import RikkaPlugin from "@rikka/Common/entities/Plugin";
import * as React from "react";
import { InstalledProduct } from "../parts/InstalledProduct";
import { Base } from "./Base";

export class Plugins extends Base {
  renderItem(item: RikkaPlugin) {
    return (
      <InstalledProduct
        key={item.id}
        product={item.Manifest!}
        enabled={item.enabled}
        path={item.path!}
        onToggle={async (v) => {
          this._toggle(item, v);
          this.forceUpdate();
        }}
      />
    );
  }

  _toggle(entity: RikkaPlugin, enabled: boolean) {
    if (enabled) $rk.PluginManager.enablePlugin(entity.id);
    else $rk.PluginManager.disablePlugin(entity.id);
  }

  getItems() {
    return Array.from($rk.PluginManager.pluginInstances.values());
  }
}
