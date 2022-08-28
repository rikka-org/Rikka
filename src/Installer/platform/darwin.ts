import { DiscordPath } from "Installer/typings/discordPath";
import basePlatform from "./basePlatform";

export default class darwin extends basePlatform {
  readonly canaryPaths = [
    {
      path: "/Applications/Discord Canary.app/Contents",
      needsElevation: true,
    },
  ];

  readonly ptbPaths = [
    {
      path: "/Applications/Discord PTB.app/Contents",
      needsElevation: true,
    },
  ];

  readonly stablePaths = [
    {
      path: "/Applications/Discord.app/Contents",
      needsElevation: true,
    },
  ];

  readonly paths = {
    canary: this.canaryPaths,
    ptb: this.ptbPaths,
    stable: this.stablePaths,
  };
}
