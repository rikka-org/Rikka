import { getModule } from "../webpack";
import AsyncComponent from "./AsyncComponent";

export const ContextMenu = AsyncComponent.fetchFromProps("MenuGroup", "default") as any;
export const Text = AsyncComponent.fromDisplayName("LegacyText") as any;

// @ts-ignore
getModule("MenuGroup", true, true).then((ContextMenu: any) => {
  const { MenuItemColor } = getModule("MenuItemColor") as any;
  // dumbass workaround
  const t = this as any;

  t.ContextMenu.CheckboxItem = ContextMenu.MenuCheckboxItem;
  t.ContextMenu.ControlItem = ContextMenu.MenuControlItem;
  t.ContextMenu.RadioItem = ContextMenu.MenuRadioItem;
  t.ContextMenu.Separator = ContextMenu.MenuSeparator;
  t.ContextMenu.Group = ContextMenu.MenuGroup;
  t.ContextMenu.Style = ContextMenu.MenuStyle;
  t.ContextMenu.Item = ContextMenu.MenuItem;
  t.ContextMenu.Item.Colors = MenuItemColor;
  t.ContextMenu.Menu = ContextMenu.default;
});

export default this;
