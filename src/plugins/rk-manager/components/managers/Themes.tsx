import Theme from "@rikka/Common/entities/Theme";
import * as React from "react";
import { InstalledProduct } from "../parts/InstalledProduct";
import { Base } from "./Base";

export class Themes extends Base {
  renderItem(item: Theme) {
    return (
      <InstalledProduct
        key={item.id}
        product={{
          name: item.themeManifest!.name,
          description: `${item.themeManifest?.description}`,
          author: {
            name: item.themeManifest?.author ?? "Unknown",
            uid: item.themeManifest?.author ?? "",
          },
          source_url: "",
          license: item.themeManifest?.license ?? "No license",
          version: item.themeManifest?.version ?? "1.0.0",
          permissions: [""],
        }}
        enabled={item.enabled}
        path={item.path!}
        onToggle={async (v) => {
          this._toggle(item, v);
          this.forceUpdate();
        }}
      />
    );
  }

  _toggle(item: Theme, enable: boolean) {
    if (enable) {
      item._load();
    } else {
      item._unload();
    }
  }

  getItems() {
    return Array.from($rk.styleManager.themes.values());
  }
}
