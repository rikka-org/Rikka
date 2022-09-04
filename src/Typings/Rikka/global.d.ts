import Rikka from "@rikka/index";
import { discordWindow } from "Typings/Discord/discordWindow";
import StyleManager from "../../Rikka/managers/StyleManager";

declare global {
    const $rk: Rikka;
    interface Window extends discordWindow {
        $rk: Rikka;
        rikka: Rikka;
        webContents: {
            _rikkaPreload: any
        }
        __$$DoNotTrackCache?: { [ key: string ]: any};
    }
}
