//@ts-ignore
import { getModule, contextMenu } from "@rikka/API/webpack";
const React = require("react");

const { LinkButton } = getModule("LinkButton") as any;
const { openContextMenu } = contextMenu;

export function Dashboard() {
  return (
    <LinkButton
      icon={() => (
        <>
          <div>"mogus"</div>
        </>
      )}
      route="/rikka"
      text="Dashboard"
      selected={"/rikka"}
      onContextMenu={(evt: any) => openContextMenu(evt, () => <></>)}
    />
  );
}
