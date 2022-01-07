import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { GetDiscordInstallPath } from "../Utils/AppFinder";

const discordInstall = GetDiscordInstallPath();

export async function InjectRikka() {    
    if (!discordInstall) return;

    /** Failsafe for corrupted installs. */
    if(!existsSync(discordInstall)) await mkdir(discordInstall)
        .catch(e => { throw new Error(`Failed to create directory for Rikka! ${e}`) });
        
    // Write a file to the Discord installation directory that calls a require() on the Rikka module.
    writeFile(join(discordInstall, "Rikka.js"), `require("${join(__dirname, "..", "..", "Rikka.js")}");`)
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

    // Delete the rikka.js file
    unlink(join(discordInstall, "Rikka.js"))

    console.log("Rikka uninjected successfully!");
}
