import { getModule } from "../webpack";
import AsyncComponent from "./AsyncComponent";

// More generic stuff
export const Button = AsyncComponent.from(getModule("Link", "Hovers", "Sizes", true)) as any;
export const Switch = AsyncComponent.fromDisplayName("Switch") as any;
export const TabBar = AsyncComponent.fromDisplayName("TabBar") as any;
export const Text = AsyncComponent.fromDisplayName("LegacyText") as any;

// Usecase-specific stuff
export const ContextMenu = AsyncComponent.fetchFromProps("MenuGroup", "default") as any;
export const HelpMessage = AsyncComponent.fromDisplayName("HelpMessage") as any;
export const Tooltip = AsyncComponent.fromDisplayName("TooltipContainer") as any;
export const Avatar = AsyncComponent.fetchFromProps("AnimatedAvatar", "default") as any;
export const Modal = AsyncComponent.fetchFromProps("ModalRoot") as any;

getModule("MenuGroup", true, true).then((contextMenu: any) => {
  const { MenuItemColor } = getModule("MenuItemColor") as any;

  ContextMenu.CheckboxItem = contextMenu.MenuCheckboxItem;
  ContextMenu.ControlItem = contextMenu.MenuControlItem;
  ContextMenu.RadioItem = contextMenu.MenuRadioItem;
  ContextMenu.Separator = contextMenu.MenuSeparator;
  ContextMenu.Group = contextMenu.MenuGroup;
  ContextMenu.Style = contextMenu.MenuStyle;
  ContextMenu.Item = contextMenu.MenuItem;
  ContextMenu.Item.Colors = MenuItemColor;
  ContextMenu.Menu = contextMenu.default;
});

getModule((m: any) => m.link && m.Hovers, true, true).then((button: any) => {
  Button.Colors = button.Colors;
  Button.Hovers = button.Hovers;
  Button.Link = button.link;
  Button.looks = button.looks;
  Button.Sizes = button.Sizes;
});
