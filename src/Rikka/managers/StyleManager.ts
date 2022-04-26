import { IPC_Consts } from "@rikka/API/Constants";
import createHeadersHook from "@rikka/API/electron/headersHook";
import { Logger } from "@rikka/API/Utils";
import { ipcRenderer } from "electron";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { dirname, join, resolve } from "path";
import sass from "sass";

type powercordManifest = {
    name: string;
    version: string;
    description: string;
    theme: string,
    author: string,
    consent: string,
    license: string,    
}

type vizalityManifest = powercordManifest & {
    icon: string;
}

export default class StyleManager {
    private themeDirectory = resolve(__dirname, '..', '..', 'themes');
    private loadedThemes: Map<string, string> = new Map();
    private availableThemes: string[] = [];

    private async loadThemes() {
        // TODO: Load themes

        const themes: string[] = [];
        const files: string[] = []

        readdirSync(this.themeDirectory).forEach(file => {
            const filePath = resolve(this.themeDirectory, file);

            if (file.endsWith('.css')) {
                files.push(filePath);
            } else if (statSync(filePath).isDirectory()) {
                let manifest: string;

                if (existsSync(join(filePath, 'manifest.json')))
                    manifest = readFileSync(join(filePath, 'manifest.json'), 'utf8');
                else if (existsSync(join(filePath, 'powercord_manifest.json')))
                    manifest = readFileSync(join(filePath, 'powercord_manifest.json'), 'utf8');
                else return;

                const manifestData = JSON.parse(manifest) as vizalityManifest;
                files.push(resolve(filePath, manifestData.theme));
            }

            return;
        });

        files.forEach((file) => {
            try {
                let theme: string;

                if (file.endsWith('.scss')) {
                    theme = sass.compile(file).css;
                }
                
                else theme = readFileSync(file).toString(); 
                
                this.loadedThemes.set(file, theme);
                themes.push(file);
            } catch (e) {
                Logger.error(`Theme loading error: ${e}`);
            }
        });

        return themes;
    }

    async applyThemes() {
        const themes = await this.loadThemes();
        this.availableThemes = themes;

        this.loadedThemes.forEach((theme, name) => {
            // We need to make an exception in the Content Security Policy for the theme
            /*createHeadersHook(`${name}-theme`, ({ responseHeaders }, done) => {
                responseHeaders['Content-Security-Policy'] = responseHeaders['Content-Security-Policy']?.replace(/script-src\s*(?:'unsafe-inline'|'unsafe-eval'|'self'|'blob:')/i, 'script-src \'self\'');
                done({ responseHeaders });
            }); */
            this.applyTheme(theme);
        });
    }

    private applyTheme(theme: string) {
        const element = document.createElement('style');
        element.innerHTML = theme;
        document.head.appendChild(element);
    }
}
