import Compiler from "./compiler";
import sass, { compile } from "sass";

export default class scss extends Compiler {
    get compilerInfo() {
        return `sass@${sass.info}`;
    }
    
    static readonly extensions = [".scss"];

    compile() {
        return compile(this.file, {
            style: "compressed",
        }).css;
    }
}