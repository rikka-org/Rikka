import { join, resolve } from "path";

export namespace RikkaPowercord.Constants {
    export const RKPOWERCORD_FOLDER = join(__dirname, '..', 'powercord-data');
    export const RKPOWERCORD_SETTINGS = join(RikkaPowercord.Constants.RKPOWERCORD_FOLDER, 'settings');
    export const RKPOWERCORD_CACHE = join(RikkaPowercord.Constants.RKPOWERCORD_FOLDER, '.cache');
    export const RKPOWERCORD_LOGS = join(RikkaPowercord.Constants.RKPOWERCORD_FOLDER, '.logs');

    export const powercordSrcDir = join(__dirname, "..", "..", "powercord-git", "src");
    export const powercordDir = resolve(powercordSrcDir, "Powercord");
}
