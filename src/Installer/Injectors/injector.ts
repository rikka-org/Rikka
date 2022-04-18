import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { GetDiscordInstallPath } from "../Utils/AppFinder";
import { switchToRoot } from "./su";

const discordInstall = GetDiscordInstallPath();

export async function InjectRikka() {    
    if (!discordInstall) return;

    /** We don't need to elevate to modify home directories */
    if (discordInstall.needsElevation)
        if (!await switchToRoot()) return;

    /** Failsafe for corrupted installs. */
    if(!existsSync(discordInstall.path)) await mkdir(discordInstall.path, { recursive: true })
        .catch(e => { throw new Error(`Failed to create directory for Rikka! ${e}`) });
        
    // Write a file to the Discord installation directory that calls a require() on the Rikka module.
    writeFile(join(discordInstall.path, "Rikka.js"), 
        `require(\`${__dirname.replace(RegExp(sep.repeat(2), 'g'), '/')}/../..\`)`
    )
        .catch(e => { throw new Error(`Failed to write Rikka.js! ${e}`) });
    writeFile(join(discordInstall.path, 'package.json'), JSON.stringify({
        name: 'discord',
        main: 'Rikka.js'
        })
    );

    console.log("Rikka injected successfully!");
}

export async function UninjectRikka() {
    if (!discordInstall) return;

    if (discordInstall.needsElevation)
        if(!await switchToRoot()) return;

    // Delete the rikka.js file
    await rm(discordInstall.path, { recursive: true })
        .catch(e => { throw new Error(`Failed to delete Rikka.js! ${e}`) });

    console.log("Rikka uninjected successfully!");
}
