import { Rikka } from "../../Rikka";
import StyleManager from "../../Rikka/managers/StyleManager";

declare module RikkaNative {

}

declare module globalThis {
    var RikkaNative: any;
    var styleManager: StyleManager;
    var rikka: Rikka;
}