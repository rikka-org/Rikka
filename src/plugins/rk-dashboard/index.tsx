import { patch } from "@rikka/API/patcher";
import { Logger } from "@rikka/API/Utils";
import { forceUpdateElement } from "@rikka/API/Utils/React";
//@ts-ignore
import { getModule, contextMenu } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { Dashboard } from "./dashboard";
const React = require("react");

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

    patch(
      "rk-dashboard-private-channels-list-item",
      ConnectedPrivateChannelsList,
      "default",
      (_: any, res: any) => {
        try {
          if (!res.props?.children?.props?.children) {
            return;
          }

          if (res.props.children.props.children instanceof Array) {
            res.props.children.props.children.push(
              <>
                <Dashboard />
              </>
            );
          } else {
            Logger.warn(
              "Using workaround for dashboard. Please tell CanadaHonk to stop converting Arrays to Objects!"
            );
            res.props.children.props.children = [
              <>
                <Dashboard />
              </>,
              res.props.children.props.children,
            ];
          }
        } catch (e) {
          Logger.error(`Failed to patch ConnectedPrivateChannelsList: ${e}`);
        }
        setImmediate(() => forceUpdateElement(`.${channel}`, true));
      }
    );
  }
}
