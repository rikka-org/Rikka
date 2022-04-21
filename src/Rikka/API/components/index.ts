import { getModule } from "../webpack";
import AsyncComponent from "./AsyncComponent";

export const ContextMenu = AsyncComponent.fetchFromProps('MenuGroup', 'default');

// @ts-ignore
getModule('MenuGroup', true, true).then((ContextMenu: any) => {
    // @ts-ignore shut
    const { MenuItemColor } = getModule('MenuItemColor');
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
