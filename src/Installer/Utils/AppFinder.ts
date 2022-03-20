import { existsSync, readdirSync } from "fs";
import { join } from "path";

export const WindowsPaths = [
    join(process.env.LOCALAPPDATA ?? "", "DiscordCanary"),
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
    if (!inputPath) result = promptPath();
    else if (!existsSync(inputPath)) {
        console.warn("Path does not exist!");
        result = promptPath();
    }

    return result;
}

function noPath() {
    console.log("Couldn't find Discord installation path. Please manually specify the path.");
    // Get path from user input in stdin
    return promptPath();
}
/** Finds the Discord installation path based on platform. */
export function GetDiscordInstallPath(): string {
    let discordInstall: string = "";
    switch (process.platform) {
        case "win32":
            discordInstall = WindowsPaths.find(p => existsSync(p)) || "";

            /** Windows DiscordCanary installs need to be found using a regexp, 
             * since the app directory has a version number. For example, it could be app-1.0.45.  
             * */
            const dirs = discordInstall ? readdirSync(discordInstall) : [];
            // filter out the directories that don't match the regexp.
            const latestVersion = dirs.filter(p => p.startsWith('app-')).reverse()[0];
            if (latestVersion) discordInstall = join(discordInstall, latestVersion);

            break;
        case "darwin":
            discordInstall = MacOSPaths.find(p => existsSync(p)) || "";
            break;
        case "linux":
            discordInstall = LinuxPaths.find(p => existsSync(p)) || "";
            break;
        default:
            discordInstall = "";
            break;
    }

    return join(discordInstall, 'resources', 'app');
}
