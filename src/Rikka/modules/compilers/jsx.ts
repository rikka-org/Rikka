import Compiler from "./compiler";
import { readFileSync } from "fs";
import { transform, getVersion } from "sucrase";

export default class JSX extends Compiler {
    get compilerInfo() {
        return `sucrase@${getVersion()}`;
    }

    static readonly extensions = [".jsx"];

    compile() {
        const jsx = readFileSync(this.file, 'utf-8');
        return transform(jsx, {
            transforms: ["jsx"],
            filePath: this.file,
        }).code;
    }
}