import { getModule } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { patch, rkUnpatchFunction } from "@rikka/API/patcher";
import { ContextMenu } from "@rikka/API/components";
import { SettingsCategory } from "@rikka/API/settings";
import { Store } from "@rikka/API/storage";
import manifest from "./manifest.json";

const React = require("react");

export default class rkCopyRaw extends RikkaPlugin {
  private contextMenu: any;

  private unpatchMenu?: rkUnpatchFunction;

  private storage = new Store("rkCopyRaw");

  private settingsCategory = new SettingsCategory("Copy Raw", "rk-copyRaw", this.storage);

  inject() {
    $rk.settingsManager.registerSetting("rk-copyRaw", this.settingsCategory);
    this.patchContextMenu();
  }

  private async patchContextMenu(): Promise<any> {
    this.contextMenu = (await getModule(
      (m) => m.default?.displayName === "MessageContextMenu",
    )) as any;

    if (!this.contextMenu) { return setTimeout(() => this.patchContextMenu(), 1000); }

    const p = patch(
      this.contextMenu,
      "default",
      (args: any[], res: any) => {
        res.props.children.push(
          <>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item
                label={"Copy Raw data"}
                id="copy-raw-data"
                action={async () => {
                  DiscordNative.clipboard.copy(
                    JSON.stringify(args[0].message),
                  );
                }}
              />
            </ContextMenu.Group>
          </>,
        );
      },
    );

    if (p) this.unpatchMenu = p;
  }

  uninject() {
    if (this.unpatchMenu) this.unpatchMenu();
  }
}
