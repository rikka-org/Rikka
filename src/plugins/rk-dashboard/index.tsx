import { patch } from "@rikka/API/patcher";
import { findInReactTree, forceUpdateElement } from "@rikka/API/Utils/React";
// @ts-ignore
import { getModule, contextMenu } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import * as React from "react";
import manifest from "./manifest.json";

export default class rkDashboard extends RikkaPlugin {
  inject() {
    this.addDashboard();
  }

  /** Adds the Rikka dashboard to your home screen */
  private async addDashboard() {
    const ConnectedPrivateChannelsList = getModule(
      (m: any) => m.default?.displayName === "ConnectedPrivateChannelsList",
    );
    const { channel } = (await getModule("channel", "closeIcon")) as any;
    const { LinkButton } = getModule("LinkButton") as any;
    const { openContextMenu } = contextMenu;

    patch(
      "rk-dashboard-private-channels-list-item",
      ConnectedPrivateChannelsList,
      "default",
      (_: any, res: any) => {
        try {
          const { children: PrivateChannelsList } = findInReactTree(
            res,
            (props: any) => props.channels,
          ) as any;

          if (!PrivateChannelsList) return;

          if (
            !PrivateChannelsList.some(
              (channel: any) => channel?.props?.text === "Rikka",
            )
          ) {
            PrivateChannelsList.unshift(
              <LinkButton
                icon={() => <></>}
                route="/rikka"
                text="Rikka"
                selected={"/rikka"}
                onContextMenu={(evt: any) => openContextMenu(evt, () => <></>)}
              />,
            );
          }
        } catch (e) {
          this.error(`Failed to patch ConnectedPrivateChannelsList: ${e}`);
        }
        setImmediate(() => forceUpdateElement(`.${channel}`, true));
      },
    );
  }
}
