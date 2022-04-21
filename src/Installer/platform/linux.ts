import { DiscordPath } from "../typings/discordPath";
import basePlatform from "./basePlatform";

export default class linux extends basePlatform {
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
            needsElevation: true
        },
        {
            path: `${this.optDir}/DiscordPTB`,
            needsElevation: true
        },
        {
            path: `${this.optDir}/discord-ptb`,
            needsElevation: true
        },
        {
            path: `${this.flatpakDir}.DiscordPTB/x86_64/beta/active/files/discord-ptb/`,
            needsElevation: true
        },
        {
            path: `${this.homeFlatpakDir}.DiscordPTB/current/active/files/discord-ptb/`,
        }
    ];

    readonly stablePaths = [
        {
            path: `${this.shareDir}/discord`,
            needsElevation: true
        },
        {
            path: `${this.optDir}/Discord`,
            needsElevation: true
        },
        {
            path: `${this.optDir}/discord`,
            needsElevation: true
        },
        {
            path: `${this.flatpakDir}.Discord/x86_64/stable/active/files/discord/`,
            needsElevation: true
        },
        {
            path: `${this.homeFlatpakDir}.Discord/current/active/files/discord/`,
        }
    ];
    
    readonly devPaths = [
        {
            path: `${this.shareDir}/discord-development`,
            needsElevation: true
        },
        {
            path: `${this.optDir}/discord-development`,
            needsElevation: true
        },
        {
            path: `${this.optDir}/DiscordDevelopment`,
            needsElevation: true
        }
    ];

    readonly paths = {
        canary: this.canaryPaths,
        ptb: this.ptbPaths,
        stable: this.stablePaths,
        dev: this.devPaths,
        development: this.devPaths
    };
}