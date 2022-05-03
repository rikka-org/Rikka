import Compiler from "./compiler";
import { readFileSync } from "fs";
import { transform } from "sucrase";

export default class JSX extends Compiler {
    compilerInfo = `sucrase`;

    static readonly extensions = [".jsx"];

    compile() {
        const jsx = readFileSync(this.file, 'utf-8');
        return transform(jsx, {
            transforms: ["jsx"],
            filePath: this.file,
        }).code;
    }
}