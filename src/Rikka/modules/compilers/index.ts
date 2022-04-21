import { readdirSync } from "fs";
import Compiler from "./compiler";

export = readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file !== 'compiler.js')
    .map(filename => { 
        const compiler = require(`${__dirname}/${filename}`).default;

        compiler.extensions.forEach((ext: string) => {
            console.log("registered compiler for extension: " + ext);
            require.extensions[ext] = (module: any, filename: string) => {
                const compilerModule = new compiler(filename) as Compiler;
                const compiled = compilerModule.doCompilation(filename);

                return compiled;
            }
        });
    });