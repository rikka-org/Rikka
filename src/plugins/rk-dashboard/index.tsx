import { patch } from "@rikka/API/patcher";
import { Logger } from "@rikka/API/Utils";
import { forceUpdateElement } from "@rikka/API/Utils/React";
//@ts-ignore
import { getModule, contextMenu } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
const React = require("react");

const { openContextMenu } = contextMenu;

export default class rkDashboard extends RikkaPlugin {
  Manifest = {
    name: "Rikka Dashboard",
    description: "The main menu for managing Rikka.",
    author: "V3L0C1T13S",
    version: "1.0.0",
    dependencies: [],
    license: "GPL-3.0",
  };

  inject() {
    this.addDashboard();
  }

  /** Adds the Rikka dashboard to your home screen */
  private addDashboard() {
    const ConnectedPrivateChannelsList = getModule(
      (m: any) => m.default?.displayName === "ConnectedPrivateChannelsList"
    );
    const { channel } = getModule("channel", "closeIcon") as any;
    const { LinkButton } = getModule("LinkButton") as any;

    patch(
      "rk-dashboard-private-channels-list-item",
      ConnectedPrivateChannelsList,
      "default",
      (_: any, res: any) => {
        try {
          if (!res.props?.children?.props?.children) {
            return;
          }

          Logger.log("hello from the dashboard");
          res.props.children.props.children.push(
            <>
              <LinkButton
                icon={() => <></>}
                route="/rikka"
                text="Dashboard"
                selected={"/rikka"}
                onContextMenu={(evt: any) => openContextMenu(evt, () => <></>)}
              />
            </>
          );
        } catch (e) {
          Logger.error(`Failed to patch ConnectedPrivateChannelsList: ${e}`);
        }
        setImmediate(() => forceUpdateElement(`.${channel}`, true));
      }
    );
  }
}
