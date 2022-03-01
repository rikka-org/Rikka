import { existsSync } from "fs";
import path from "path";

export const WindowsPaths = [
    "C:\\Program Files (x86)\\Discord\\DiscordCanary",
]

export const MacOSPaths = [
    "/Applications/Discord Canary.app/Contents",
]

export const LinuxPaths = [
    "/usr/share/discord-canary",
    "/opt/discord-canary",
    "/opt/DiscordCanary",
    "/var/lib/flatpak/app/com.discordapp.DiscordCanary/x86_64/beta/active/files/discord-canary/"
]

function promptPath() {
    let result: string = "";
    const inputPath = prompt("Please enter the path to Discord:", "");
    if(!inputPath) result = promptPath();
    else if(!existsSync(inputPath)) {
        console.warn("Path does not exist!");
        result = promptPath();
    }
    
    return result;
}
/** Finds the Discord installation path based on platform. */
export function GetDiscordInstallPath(): string {
    let discordInstall: string = "";
    switch(process.platform) {
        case "win32":
            discordInstall = WindowsPaths.find(p => existsSync(p)) || "";
            break;
        case "darwin":
            discordInstall = MacOSPaths.find(p => existsSync(p)) || "";
            break;
        case "linux":
            discordInstall = LinuxPaths.find(p => existsSync(p)) || "";
            break;
        default:
            console.log("Couldn't find Discord installation path. Please manually specify the path.");
            // Get path from user input in stdin
            discordInstall = promptPath();
            break;
    }

    return path.join(discordInstall, 'resources', 'app');
}
