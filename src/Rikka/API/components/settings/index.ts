/* eslint-disable no-return-assign */
import { getModuleByDisplayName } from "@rikka/API/webpack";
import AsyncComponent from "../AsyncComponent";

export const SwitchItem = AsyncComponent.fromDisplayName("SwitchItem") as any;

(async () => {
  const si = await getModuleByDisplayName("SwitchItem", true, true);
  ["Sizes", "Themes"].forEach((prop) => SwitchItem[prop] = si[prop]);
})();
