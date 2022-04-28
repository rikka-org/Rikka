import { Logger } from "@rikka/API/Utils";
import { PathLike } from "fs";
import { FileHandle } from "fs/promises";
import sass from "sass";

export function compileSass(_: any, file: PathLike | FileHandle) {
    try {
        const res = sass.compile(file.toString());

        return res.css.toString();
    } catch (e) {
        Logger.error(`Failed to compile ${file}`, e);
        return "";
    }
}