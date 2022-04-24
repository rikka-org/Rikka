import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { GetDiscordInstallPath } from "../Utils/AppFinder";
import { switchToRoot } from "./su";

const AnsiEscapes = {
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    RED: '\x1b[31m'
};

export async function InjectRikka(branch: string) {
    const discordInstall = GetDiscordInstallPath(branch);

    if (!discordInstall) return;

    /** We don't need to elevate to modify home directories */
    if (discordInstall.needsElevation)
        if (!await switchToRoot()) return;

    /** Failsafe for corrupted installs. */
    if (!existsSync(discordInstall.path)) await mkdir(discordInstall.path, { recursive: true })
        .catch(e => { throw new Error(`${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to create directory for Rikka! ${e}${AnsiEscapes.RESET}`) });

    // Write a file to the Discord installation directory that calls a require() on the Rikka module.
    writeFile(join(discordInstall.path, "Rikka.js"),
        `require(\`${__dirname.replace(RegExp(sep.repeat(2), 'g'), '/')}/../..\`)`
    )
        .catch(e => { throw new Error(`${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to write Rikka.js! ${e}${AnsiEscapes.RESET}`) });
    writeFile(join(discordInstall.path, 'package.json'), JSON.stringify({
        name: 'discord',
        main: 'Rikka.js'
    })
    );

    console.log(`${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Rikka injected successfully!${AnsiEscapes.RESET}`);
}

export async function UninjectRikka(branch: string) {
    const discordInstall = GetDiscordInstallPath(branch);

    if (!discordInstall) return;

    if (discordInstall.needsElevation)
        if (!await switchToRoot()) return;

    // Delete the rikka.js file
    await rm(discordInstall.path, { recursive: true })
        .catch(e => { throw new Error(`Failed to delete Rikka.js! ${e}`) });

    console.log(`${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Rikka uninjected successfully!${AnsiEscapes.RESET}`);
}
