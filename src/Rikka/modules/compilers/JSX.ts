import Compiler from "./compiler";
import { readFileSync } from "fs";
import { transform } from "sucrase";

export default class JSX extends Compiler {
    static readonly extensions = [".jsx"];

    compile() {
        const jsx = readFileSync(this.file, 'utf-8');
        const transformed = transform(jsx, {
            transforms: ["jsx"]
        });
        return transformed.code;
    }
}