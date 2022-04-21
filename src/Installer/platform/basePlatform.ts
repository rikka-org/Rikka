import { DiscordPath } from "Installer/typings/discordPath";
import { existsSync } from "node:fs";

export default abstract class basePlatform {
    readonly abstract canaryPaths: DiscordPath[];
    readonly abstract ptbPaths: DiscordPath[];
    readonly abstract stablePaths: DiscordPath[];

    /** Finds the Discord installation path based on platform. */
    GetDiscordInstallPath() {
        return this.getPath(this.canaryPaths);
    }

    protected getPath(discordPaths: DiscordPath[]) {
        let finalpath: DiscordPath;

        discordPaths.forEach(path => {
            if (existsSync(path.path)) {
                finalpath = path;
            }
        });

        return finalpath! ?? "the fuck happened here";
    }
}