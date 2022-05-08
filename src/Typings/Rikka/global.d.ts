import Rikka from "@rikka/index";
import StyleManager from "../../Rikka/managers/StyleManager";

declare var RikkaNative: any;
var styleManager: StyleManager;

declare global {
    const RikkaNative: any;
    const rikka: Rikka;
    const $rk: Rikka;
    const DiscordNative: any;
    interface Window {
        __SPLASH__: boolean;
        $rk: Rikka;
        rikka: Rikka;
    }
}