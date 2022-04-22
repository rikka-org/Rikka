import { DiscordPath } from "../typings/discordPath";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import basePlatform from "./basePlatform";

export default class win32 extends basePlatform {
    readonly canaryPaths = [
        {
            path: join(process.env.LOCALAPPDATA ?? "", "DiscordCanary"),
        }
    ];

    readonly ptbPaths = [
        {
            path: join(process.env.LOCALAPPDATA ?? "", "DiscordPTB"),
        }
    ];

    readonly stablePaths = [
        {
            path: join(process.env.LOCALAPPDATA ?? "", "Discord"),
        }
    ];

    readonly devPaths = [
        {
            path: join(process.env.LOCALAPPDATA ?? "", "DiscordDevelopment"),
        }
    ];

    readonly paths = {
        canary: this.canaryPaths,
        ptb: this.ptbPaths,
        stable: this.stablePaths,
        dev: this.devPaths,
        development: this.devPaths
    };

    GetDiscordInstallPath(pathType: string) {
        let discordInstall: DiscordPath;

        discordInstall = this.getPath(this.canaryPaths);

        /** Windows DiscordCanary installs need to be found using a regexp, 
         * since the app directory has a version number. For example, it could be app-1.0.45.  
         * */
        const dirs = discordInstall ? readdirSync(discordInstall.path) : [];
        // filter out the directories that don't match the regexp.
        const latestVersion = dirs.filter(p => p.startsWith('app-')).reverse()[0];
        if (latestVersion) discordInstall.path = join(discordInstall.path, latestVersion);

        return discordInstall;
    }
}