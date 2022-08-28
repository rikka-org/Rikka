import { existsSync } from "node:fs";
import { DiscordPath } from "../typings/discordPath";

export default abstract class basePlatform {
    readonly abstract canaryPaths: DiscordPath[];

    readonly abstract ptbPaths: DiscordPath[];

    readonly abstract stablePaths: DiscordPath[];

    readonly abstract paths: { [key: string]: DiscordPath[] };

    /** Finds the Discord installation path based on platform. */
    GetDiscordInstallPath(pathType: string) {
      const path = this.paths[pathType];
      if (!path) throw new Error(`Invalid path type: ${pathType}`);

      return this.getPath(path);
    }

    protected getPath(discordPaths: DiscordPath[]) {
      let finalpath: DiscordPath;

      discordPaths.forEach((path) => {
        if (existsSync(path.path)) {
          finalpath = path;
        }
      });

      if (!finalpath!) throw new Error("No valid discord install found");

      return finalpath;
    }
}
