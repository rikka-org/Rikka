import { readFileSync } from "fs";
import { transform } from "sucrase";
import Compiler from "./compiler";

export default class TSX extends Compiler {
    static readonly extensions = [".tsx"];

    compile() {
        const tsx = readFileSync(this.file, "utf8");
        return transform(tsx, {
            transforms: ["jsx", "typescript"],
            filePath: this.file,
        }).code;
    }
}