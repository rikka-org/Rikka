import { DiscordPath } from "../typings/discordPath";
import linux from "./linux";

// FIXME: Needs to be able to detect compat.linux paths.
export class freebsd extends linux {
  shareDir = "/compat/linux/usr/share";

  optDir = "/compat/linux/opt";

  /**
   * FIXME: Flatpaks are somewhat broken on FreeBSD, may need to warn the user
   * if they're using one.
  */
  flatpakDir = "/compat/linux/var/lib/flatpak/app/com.discordapp";

  getPath(discordPaths: DiscordPath[]) {
    console.warn("WARNING: FreeBSD doesn't have official Discord support");
    console.warn("Report any bugs you encounter, but make sure to tell us you're on FreeBSD!");
    return super.getPath(discordPaths);
  }
}
