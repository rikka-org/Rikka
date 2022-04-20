import { existsSync, readdirSync } from "fs";
import { join } from "path";

type DiscordPath = {
    path: string,
    needsElevation?: boolean
}

export const WindowsPaths: DiscordPath[] = [
    {
        path: join(process.env.LOCALAPPDATA ?? "", "DiscordCanary"),
    }
]

export const MacOSPaths: DiscordPath[] = [
    {
        path: "/Applications/Discord Canary.app/Contents",
    },
]

export const LinuxPaths: DiscordPath[] = [
    {
        path: "/usr/share/discord-canary",
        needsElevation: true
    },
    { 
        path: "/opt/DiscordCanary",
        needsElevation: true
    },
    {
        path: "/opt/discord-canary",
        needsElevation: true
    },
    {
        path: "/var/lib/flatpak/app/com.discordapp.DiscordCanary/x86_64/beta/active/files/discord-canary/",
        needsElevation: true
    },
    { 
        path: `${process.env.HOME}/.local/share/flatpak/app/com.discordapp.DiscordCanary/current/active/files/discord-canary/`,
    }
]

function getPath(discordPaths: DiscordPath[]) {
    let finalpath: DiscordPath;

    discordPaths.forEach(path => {
        if (existsSync(path.path)) {
            finalpath = path;
        }
    });

    return finalpath! ?? "the fuck happened here";
}
/** Finds the Discord installation path based on platform. */
export function GetDiscordInstallPath() {
    let discordInstall: DiscordPath;
    switch (process.platform) {
        case "win32":
            discordInstall = getPath(WindowsPaths);

            /** Windows DiscordCanary installs need to be found using a regexp, 
             * since the app directory has a version number. For example, it could be app-1.0.45.  
             * */
            const dirs = discordInstall ? readdirSync(discordInstall.path) : [];
            // filter out the directories that don't match the regexp.
            const latestVersion = dirs.filter(p => p.startsWith('app-')).reverse()[0];
            if (latestVersion) discordInstall.path = join(discordInstall.path, latestVersion);

            break;
        case "darwin":
            discordInstall = getPath(MacOSPaths);
            break;
        case "linux":
            discordInstall = getPath(LinuxPaths);
            break;
        default:
            throw new Error("Unsupported platform!");
    }

    discordInstall.path = join(discordInstall.path, "resources", "app");
    return discordInstall;
}
