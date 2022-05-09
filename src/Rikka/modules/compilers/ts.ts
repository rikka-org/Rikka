import { readFileSync } from "fs";
import { transform, getVersion } from "sucrase";
import Compiler from "./compiler";

export default class TS extends Compiler {
  get compilerInfo() {
    return `sucrase@${getVersion()}`;
  }

  static readonly extensions = [".ts"];

  compile() {
    const ts = readFileSync(this.file, "utf-8");
    return transform(ts, {
      transforms: ["typescript"],
      filePath: this.file,
    }).code;
  }
}
