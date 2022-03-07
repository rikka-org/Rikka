import { Rikka } from "../../Rikka";

declare module globalThis {
    var RikkaNative: any;
    var sm: any;
    var rikka: Rikka;
}