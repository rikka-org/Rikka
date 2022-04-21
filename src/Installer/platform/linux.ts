import { DiscordPath } from "Installer/typings/discordPath";
import basePlatform from "./basePlatform";

export default class Linux extends basePlatform {
    private readonly shareDir = "/usr/share";
    private readonly optDir = "/opt";
    private readonly flatpakDir = "/var/lib/flatpak/app/com.discordapp";
    private readonly homeFlatpakDir = `${process.env.HOME}/.local/share/flatpak/app/com.discordapp`;
    readonly canaryPaths = [
        {
            path: `${this.shareDir}/discord-canary`,
            needsElevation: true
        },
        {
            path: `${this.optDir}/DiscordCanary`,
            needsElevation: true
        },
        {
            path: `${this.optDir}/discord-canary`,
            needsElevation: true
        },
        {
            path: `${this.flatpakDir}.DiscordCanary/x86_64/beta/active/files/discord-canary/`,
            needsElevation: true
        },
        {
            path: `${this.homeFlatpakDir}.DiscordCanary/current/active/files/discord-canary/`,
        }
    ];

    readonly ptbPaths = [
        {
            path: `${this.shareDir}/discord-ptb`,
        },
        {
            path: `${this.optDir}/DiscordPTB`,
        },
        {
            path: `${this.optDir}/discord-ptb`,
        },
        {
            path: `${this.flatpakDir}.DiscordPTB/x86_64/beta/active/files/discord-ptb/`,
        },
        {
            path: `${this.homeFlatpakDir}.DiscordPTB/current/active/files/discord-ptb/`,
        }
    ];

    readonly stablePaths = [
        {
            path: `${this.shareDir}/discord`,
        },
        {
            path: `${this.optDir}/Discord`,
        },
        {
            path: `${this.optDir}/discord`,
        },
        {
            path: `${this.flatpakDir}.Discord/x86_64/stable/active/files/discord/`,
        },
        {
            path: `${this.homeFlatpakDir}.Discord/current/active/files/discord/`,
        }
    ];
}