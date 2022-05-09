import { join } from "node:path";
import basePlatform from "Installer/platform/basePlatform";
import { DiscordPath } from "../typings/discordPath";

/** Finds the Discord installation path based on platform. */
export function GetDiscordInstallPath(pathType: string) {
  const PlatformModule = require(`../platform/${process.platform}`).default;
  const platform = new PlatformModule() as basePlatform;

  const discordInstall = platform.GetDiscordInstallPath(pathType);

  discordInstall.path = join(discordInstall.path, "resources", "app");
  return discordInstall;
}
