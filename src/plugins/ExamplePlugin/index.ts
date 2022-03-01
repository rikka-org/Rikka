import { RikkaPlugin } from '../../Common/Plugin';
/** BS workaround for TS not including .json by default (Seriously, why is this not a default M$?) */
import * as pkg from './package.json';

export default class ExamplePlugin extends RikkaPlugin {
    name = "Example Plugin";
    description = "An example plugin for Rikka.";
    author = "V3L0C1T13S";

    inject() {
        console.log("Example Plugin is starting...");
    }

    public override discordReady(): void {
        console.log("Put your init code here!");
    }
}
