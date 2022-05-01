import { readFileSync } from "fs";
import { transform } from "sucrase";
import Compiler from "./compiler";

export default class TS extends Compiler {
    static readonly extensions = [".ts"];

    compile() {
        const ts = readFileSync(this.file, 'utf-8');
        const transformed = transform(ts, {
            transforms: ["typescript"]
        });
        return transformed.code;
    }
}