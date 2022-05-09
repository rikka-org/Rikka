import Rikka from "@rikka/index";
import { discordWindow } from "Typings/Discord/discordWindow";
import StyleManager from "../../Rikka/managers/StyleManager";

declare global {
    const RikkaNative: any;
    const $rk: Rikka;
    interface Window extends discordWindow {
        __SPLASH__: boolean;
        $rk: Rikka;
        rikka: Rikka;
        webContents: {
            _rikkaPreload: any
        }
    }
}
