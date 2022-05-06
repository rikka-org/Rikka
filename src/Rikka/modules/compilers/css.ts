import { readFileSync } from "fs";
import Compiler from "./compiler";

export default class css extends Compiler {
    get compilerInfo() {
        return "css";
    }

    static readonly extensions = [".css"];

    compile() {
        return readFileSync(this.file);
    }
}