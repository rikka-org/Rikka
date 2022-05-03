import Compiler from "./compiler";
import { compile } from "sass";

export default class scss extends Compiler {
    compilerInfo = "sass";
    static readonly extensions = [".scss"];

    compile() {
        return compile(this.file, {
            style: "compressed",
        }).css;
    }
}