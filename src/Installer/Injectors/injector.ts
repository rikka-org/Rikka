import { existsSync } from "node:fs";
import { mkdir, rmdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { GetDiscordInstallPath } from "../Utils/AppFinder";
import { addFlatpakPerms } from "./flatpakPermAdder";
import { switchToRoot } from "./su";

const discordInstall = GetDiscordInstallPath();

export async function InjectRikka() {    
    if (!discordInstall) return;

    if(!await switchToRoot()) return;

    /** Failsafe for corrupted installs. */
    if(!existsSync(discordInstall)) await mkdir(discordInstall)
        .catch(e => { throw new Error(`Failed to create directory for Rikka! ${e}`) });
        
    // Write a file to the Discord installation directory that calls a require() on the Rikka module.
    writeFile(join(discordInstall, "Rikka.js"), `require("${join(__dirname, "..", "..")}");`)
        .catch(e => { throw new Error(`Failed to write Rikka.js! ${e}`) });
    writeFile(join(discordInstall, 'package.json'), JSON.stringify({
        name: 'discord',
        main: 'Rikka.js'
        })
    );

    console.log("Rikka injected successfully!");
}

export async function UninjectRikka() {
    if (!discordInstall) return;

    if(!await switchToRoot()) return;

    // Delete the rikka.js file
    await rmdir(discordInstall, { recursive: true })
        .catch(e => { throw new Error(`Failed to delete Rikka.js! ${e}`) });

    console.log("Rikka uninjected successfully!");
}
