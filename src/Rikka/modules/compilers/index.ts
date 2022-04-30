import { Logger } from "@rikka/API/Utils";
import { readdirSync } from "fs";
import { join } from "path";
import Compiler from "./compiler";

export = readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file !== 'compiler.js')
    .map(filename => { 
        const compiler = require(join(__dirname, filename)).default;

        compiler.extensions.forEach((ext: string) => {
            console.log("registered compiler for extension: " + ext);
            require.extensions[ext] = (module: any, filename: string) => {
                const compilerModule = new compiler(filename) as Compiler;
                const compiled = compilerModule.doCompilation(filename);
                Logger.log("compiled code: " + compiled);

                module._compile(compiled, filename);
            }
        });
    });