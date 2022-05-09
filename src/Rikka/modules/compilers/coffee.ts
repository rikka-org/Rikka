import { _compileFile } from "coffeescript";
import Compiler from "./compiler";

export default class coffee extends Compiler {
  get compilerInfo() {
    return "coffee";
  }

  static readonly extensions: string[] = [".coffee"];

  compile() {
    return _compileFile(this.file);
  }
}
