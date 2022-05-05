import { Logger } from "@rikka/API/Utils/logger";
//@ts-ignore
import { getModule } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { patch } from "@rikka/API/patcher";
const React = require("react");
import manifest from "./manifest.json";
import { ContextMenu } from "@rikka/API/components";

export default class rkCopyRaw extends RikkaPlugin {
  private contextMenu: any;

  inject() {
    this.patchContextMenu();
  }

  private async patchContextMenu(): Promise<any> {
    this.contextMenu = (await getModule(
      (m: any) => m.default?.displayName === "MessageContextMenu"
    )) as any;

    if (!this.contextMenu)
      return setTimeout(() => this.patchContextMenu(), 1000);

    patch(this.contextMenu, "default", (args: any[], res: any) => {
      Logger.log("yoooo im injected wooooo");
      res.props.children.push(
        <>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item
              label={"Copy Raw data"}
              id="copy-raw-data"
              action={async () => {
                (DiscordNative as any).clipboard.copy(
                  JSON.stringify(args[0].message)
                );
              }}
            />
          </ContextMenu.Group>
        </>
      );
    });
  }
}
