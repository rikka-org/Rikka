import { Logger } from "@rikka/API/Utils";
import { readdirSync } from "fs";
import { join } from "path";
import Compiler from "./compiler";

const compilers: Map<string, any> = new Map();

readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file !== 'compiler.js')
    .map(filename => {
        const compiler = require(join(__dirname, filename)).default;
        compilers.set(compiler.extensions[0], compiler);

        compiler.extensions.forEach((ext: string) => {
            console.log("registered compiler for extension: " + ext);
            require.extensions[ext] = (module: any, filename: string) => {
                Logger.log("Module: " + module);
                const compilerModule = new compiler(filename) as Compiler;
                const compiled = compilerModule.doCompilation();

                module._compile(compiled, filename);
            }
        });
    });

export function getCompiler(file: string) {
    try {
        const extension = file.split(".").pop() ?? "";
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