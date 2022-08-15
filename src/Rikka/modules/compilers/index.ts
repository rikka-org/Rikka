import { readdirSync } from "fs";
import { join } from "path";
import Compiler from "./compiler";

type Constructor<T> = new (...args: any[]) => T;

const compilers: Map<string, Constructor<Compiler>> = new Map();

readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file !== "compiler.js")
  .forEach((filename) => {
    const Compiler = require(join(__dirname, filename)).default;

    Compiler.extensions.forEach((ext: string) => {
      compilers.set(ext, Compiler);
      require.extensions[ext] = (module: any, filename: string) => {
        const compilerModule = new Compiler(filename) as Compiler;
        const compiled = compilerModule.doCompilation();

        module._compile(compiled, filename);
      };
    });
  });

export function getCompiler(file: string) {
  const extension = file.split(".").pop()?.toLowerCase() ?? "";
  const compiler = compilers.get(`.${extension}`);

  if (!compiler) {
    throw new Error(`No compiler found for extension ${extension}`);
  }

  return compiler;
}
