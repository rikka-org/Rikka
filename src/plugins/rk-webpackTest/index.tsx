import { Logger } from "@rikka/API/Utils/logger";
//@ts-ignore
import { getModule } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { patch } from "@rikka/API/patcher";
import { ContextMenu } from "@rikka/API/components";
const React = require("react");
import manifest from "./manifest.json";

export default class webpackTest extends RikkaPlugin {
  private contextMenu: any;

  inject() {
    this.patchContextMenu();
  }

  private patchContextMenu(): NodeJS.Timeout | undefined {
    this.contextMenu = getModule(
      (m: any) => m.default?.displayName === "MessageContextMenu"
    ) as any;

    if (!this.contextMenu)
      return setTimeout(() => this.patchContextMenu(), 1000);

    patch(this.contextMenu, "default", (args: any[], res: any) => {
      Logger.log("yoooo im injected wooooo");
      res.props.children.push(
        <>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item
              label={"sus among us"}
              id="test-menu"
              action={async () => {
                console.log("hiihihihihihi");
              }}
            />
          </ContextMenu.Group>
        </>
      );
    });

    return;
  }
}
