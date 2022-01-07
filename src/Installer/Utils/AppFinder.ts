import { existsSync } from "fs";
import path from "path";

export const WindowsPaths = [
    "C:\\Program Files (x86)\\Discord\\DiscordCanary",
]

export const LinuxPaths = [
    "/usr/share/discord-canary",
    "/opt/discord-canary",
    "/opt/DiscordCanary"
]


/** Finds the Discord installation path based on platform. */
export function GetDiscordInstallPath(): string {
    let discordInstall: string = "";
    switch(process.platform) {
        case "win32":
            discordInstall = WindowsPaths.find(p => existsSync(p)) || "";
            break;
        case "linux":
            discordInstall = LinuxPaths.find(p => existsSync(p)) || "";
            break;
        default:
            console.log("Couldn't find Discord installation path. Please manually specify the path.");
            // Get path from user input in stdin
            discordInstall = "";
            break;
    }

    return path.join(discordInstall, 'resources', 'app');
}
