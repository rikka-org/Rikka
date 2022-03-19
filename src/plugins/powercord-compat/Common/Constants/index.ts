import { join, resolve } from "path";

export namespace RikkaPowercord.Constants {
    export const RKPOWERCORD_FOLDER = join(__dirname, '..', 'powercord-data');
    export const powercordSrcDir = join(__dirname, "..", "..", "powercord-git", "src");
    export const powercordDir = resolve(powercordSrcDir, "Powercord");
}
