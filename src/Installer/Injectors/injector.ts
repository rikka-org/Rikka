/* eslint-disable no-console */
import { AnsiEscapes } from "@rikka/API/Utils/strings/ansiCodes";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { GetDiscordInstallPath } from "../Utils/AppFinder";
import { switchToRoot } from "./su";

export async function InjectRikka(branch: string) {
  const discordInstall = GetDiscordInstallPath(branch);

  if (!discordInstall) return;

  /** We don't need to elevate to modify home directories */
  if (discordInstall.needsElevation) { if (!await switchToRoot()) return; }

  /** Failsafe for corrupted installs. */
  if (!existsSync(discordInstall.path)) {
    await mkdir(discordInstall.path, { recursive: true })
      .catch((e) => { throw new Error(`${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to create directory for Rikka! ${e}${AnsiEscapes.RESET}`); });
  }

  if (discordInstall.path.includes("flatpak")) {
    const discordName = (discordInstall.path.includes("DiscordCanary") ? "DiscordCanary" : "Discord");
    const command = `${discordInstall.needsElevation ? "sudo flatpak override" : "flatpak override --user"} com.discordapp.${discordName} --filesystem=${join(__dirname, "../../..")}`;

    console.log(`${AnsiEscapes.YELLOW}NOTE:${AnsiEscapes.RESET} You seem to be using a flatpak install.`);
    console.log("You will need to allow Discord access to Rikka's install directory.");
    console.log(`You can do so by running this command: ${AnsiEscapes.YELLOW}${command}${AnsiEscapes.RESET}`);
    console.log("Some features of Rikka may not work properly, such as auto updates.", "\n");
  }

  // Write a file to the Discord installation directory that calls a require() on the Rikka module.
  writeFile(
    join(discordInstall.path, "Rikka.js"),
    `require(\`${__dirname.replace(RegExp(sep.repeat(2), "g"), "/")}/../..\`)`,
  )
    .catch((e) => { throw new Error(`${AnsiEscapes.BOLD}${AnsiEscapes.RED}Failed to write Rikka.js! ${e}${AnsiEscapes.RESET}`); });
  writeFile(join(discordInstall.path, "package.json"), JSON.stringify({
    name: "discord",
    main: "Rikka.js",
  }));

  console.log(`${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Rikka injected successfully!${AnsiEscapes.RESET}`);
}

export async function UninjectRikka(branch: string) {
  const discordInstall = GetDiscordInstallPath(branch);

  if (!discordInstall) return;

  if (discordInstall.needsElevation) { if (!await switchToRoot()) return; }

  // Delete the rikka.js file
  await rm(discordInstall.path, { recursive: true })
    .catch((e) => { throw new Error(`Failed to delete Rikka.js! ${e}`); });

  console.log(`${AnsiEscapes.BOLD}${AnsiEscapes.GREEN}Rikka uninjected successfully!${AnsiEscapes.RESET}`);
}
