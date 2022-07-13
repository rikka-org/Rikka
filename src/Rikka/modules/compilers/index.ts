import { Logger } from "@rikka/API/Utils";
import { readdirSync } from "fs";
import { join } from "path";
import Compiler from "./compiler";

const compilers: Map<string, any> = new Map();

readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file !== "compiler.js")
  // eslint-disable-next-line array-callback-return
  .map((filename) => {
    const Compiler = require(join(__dirname, filename)).default;
    compilers.set(Compiler.extensions[0], Compiler);

    Compiler.extensions.forEach((ext: string) => {
      require.extensions[ext] = (module: any, filename: string) => {
        const compilerModule = new Compiler(filename) as Compiler;
        const compiled = compilerModule.doCompilation();

        module._compile(compiled, filename);
      };
    });
  });

export function getCompiler(file: string) {
  try {
    const extension = file.split(".").pop()?.toLowerCase() ?? "";
    const compiler = require(join(__dirname, extension)).default;

    if (!compiler) {
      Logger.warn(`No compiler found for extension: ${extension}`);
      return;
    }

    return compiler;
  } catch (e) {
    Logger.error(e);
  }
}
