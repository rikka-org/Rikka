import { readFileSync } from "fs";
import { transform, getVersion } from "sucrase";
import Compiler from "./compiler";

export default class TSX extends Compiler {
  get compilerInfo() {
    return `sucrase@${getVersion()}`;
  }

  static readonly extensions = [".tsx"];

  compile() {
    const tsx = readFileSync(this.file, "utf8");
    return transform(tsx, {
      transforms: ["jsx", "typescript", "imports"],
      filePath: this.file,
    }).code;
  }
}
