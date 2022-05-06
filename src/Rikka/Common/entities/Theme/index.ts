import { createElement } from "@rikka/API/Utils/DOM";
import { getCompiler } from "@rikka/modules/compilers";
import Compiler from "@rikka/modules/compilers/compiler";
import { powercordManifest, rikkaManifest, vizalityManifest } from "./typings/manifestTypes";
import Updatable from "../Updatable";
import { existsSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

type manifestTypes = powercordManifest | vizalityManifest | rikkaManifest;

export default class Theme extends Updatable {
    cssCode?: string;
    private file: string;

    private compiler: Compiler;

    applied: boolean = false;

    private htmlElement?: HTMLStyleElement;

    type = "theme";

    themeManifest?: manifestTypes; 

    constructor(file: string) {
        super();

        if (statSync(file).isDirectory()) {
            // We can assume this has at least one manifest type
            const manifestFile = resolve(file, 'manifest.json');
            if (existsSync(manifestFile)) {
                this.themeManifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
                this.file = resolve(file, this.themeManifest!.theme);
            } else this.file = "";
        } else this.file = file;

        const compiler = getCompiler(this.file);
        this.compiler = new compiler(this.file);
    }

    async _load() {
        if (this.applied) return;

        this.cssCode = this.compiler.doCompilation();
        const style = createElement('style', {
            id: `${this.type}-${this.id}`,
            'rk-style': true,
            [`rk-${this.type}`]: true
        }) as HTMLStyleElement;
        style.innerHTML = this.cssCode;
        document.head.appendChild(style);

        this.htmlElement = style;
    }

    _unload() {
        if (!this.applied || !this.htmlElement) return;

        document.head.removeChild(this.htmlElement);
        this.applied = false;
    }
}