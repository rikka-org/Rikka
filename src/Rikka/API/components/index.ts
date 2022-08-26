/* eslint-disable no-return-assign */
import { getModule, getModuleByDisplayName } from "../webpack";
import AsyncComponent from "./AsyncComponent";

const fetchByProp = async (prop: any, propName?: any) => {
  const mdl = await getModule([prop]);
  return mdl[propName || prop];
};

// More generic stuff
export const Button = AsyncComponent.from(getModule("Link", "Hovers", "Sizes", true)) as any;
export const FormNotice = AsyncComponent.fromDisplayName("FormNotice") as any;
export const Card = AsyncComponent.fromDisplayName(("Card")) as any;
export const Clickable = AsyncComponent.fromDisplayName("Clickable") as any;
export const Spinner = AsyncComponent.fromDisplayName("Spinner") as any;
export const TabBar = AsyncComponent.fromDisplayName("TabBar") as any;
export const Text = AsyncComponent.fromDisplayName("LegacyText") as any;
export const Tooltip = AsyncComponent.from(fetchByProp("TooltipContainer")) as any;
export const HeaderBar = AsyncComponent.fromDisplayName("HeaderBar") as any;

// Usecase-specific stuff
export const ContextMenu = AsyncComponent.fetchFromProps("MenuGroup", "default") as any;
export const HelpMessage = AsyncComponent.fromDisplayName("HelpMessage") as any;
export const Avatar = AsyncComponent.fetchFromProps("AnimatedAvatar", "default") as any;
export const Modal = AsyncComponent.fetchFromProps("ModalRoot") as any;
export const Flex = AsyncComponent.fromDisplayName("Flex") as any;

export * from "./Divider";
export * from "./Switch";

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

getModuleByDisplayName("FormNotice", true, true).then((notice: any) => {
  ["Types"].forEach((prop) => FormNotice[prop] = notice[prop]);
});
getModule((m: any) => m.DropdownSizes, true, true).then((btn: any) => {
  ["DropdownSizes", "Sizes", "Colors", "Looks"].forEach((prop) => Button[prop] = btn[prop]);
});
getModuleByDisplayName("HeaderBar", true, true).then((hb: any) => {
  ["Icon", "Title", "Divider"].forEach((prop) => HeaderBar[prop] = hb[prop]);
});
getModuleByDisplayName("TabBar", true, true).then((tab: any) => {
  ["Types", "Header", "Item", "Separator"].forEach((prop) => TabBar[prop] = tab[prop]);
});
getModuleByDisplayName("Card", true, true).then((card: any) => {
  ["Types"].forEach((prop) => Card[prop] = card[prop]);
});
getModuleByDisplayName("LegacyText", true, true).then((text: any) => {
  ["Colors", "Family", "Sizes", "Weights"].forEach((prop) => Text[prop] = text[prop]);
});
getModuleByDisplayName("Flex", true, true).then((fl: any) => {
  ["Direction", "Justify", "Align", "Wrap", "Child"].forEach((prop) => Flex[prop] = fl[prop]);
});
