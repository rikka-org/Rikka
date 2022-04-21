import { DiscordPath } from "../typings/discordPath";
import { join } from "path";
import basePlatform from "Installer/platform/basePlatform";

/** Finds the Discord installation path based on platform. */
export function GetDiscordInstallPath() {
    let discordInstall: DiscordPath;
    const platformModule = require(`../platform/${process.platform}`).default;
    const platform = new platformModule() as basePlatform;

    discordInstall = platform.GetDiscordInstallPath();

    discordInstall.path = join(discordInstall.path, "resources", "app");
    return discordInstall;
}
