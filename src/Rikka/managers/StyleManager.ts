import { Store } from "@rikka/API/storage";
import { Logger } from "@rikka/API/Utils";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, resolve } from "path";
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

type rikkaManifest = vizalityManifest & {

}

type themeCache = {
    lastModified: number,
}

export default class StyleManager {
    private themeDirectory = resolve(__dirname, '..', '..', 'themes');
    private loadedThemes: Map<string, string> = new Map();
    private availableThemes: string[] = [];

    private cacheStore = new Store("StyleManager");

    constructor() {
        this.cacheStore.loadFromFile("cache.json");
    }

    private loadThemes() {
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
                    // Invert \ to /, then find file name
                    const fileName = file.replace(/\\/g, '/').split('/').pop() ?? "";
                    Logger.log(`Loading theme ${fileName}`);

                    const cache = this.cacheStore.get(fileName);
                    if (!cache) this.cacheStore.set(fileName, { lastModified: 0 });

                    const cacheModified = this.cacheStore.get(fileName).lastModified;
                    const sourceModified = statSync(file).mtime.getTime();

                    const cached = this.cacheStore.readRaw(fileName);
                    if (cached && cacheModified === sourceModified) theme = cached;
                    else {
                        Logger.log(`Compiling theme ${fileName}`);
                        theme = sass.compile(file, {
                            style: 'compressed',
                        }).css;
                        this.cacheStore.set(fileName, {
                            lastModified: sourceModified,
                        });

                        this.cacheStore.writeRaw(fileName, theme);
                    }
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
        const themes = this.loadThemes();
        this.availableThemes = themes;

        this.loadedThemes.forEach((theme, name) => {
            // We need to make an exception in the Content Security Policy for the theme
            /*createHeadersHook(`${name}-theme`, ({ responseHeaders }, done) => {
                responseHeaders['Content-Security-Policy'] = responseHeaders['Content-Security-Policy']?.replace(/script-src\s*(?:'unsafe-inline'|'unsafe-eval'|'self'|'blob:')/i, 'script-src \'self\'');
                done({ responseHeaders });
            }); */
            this.applyTheme(theme);
        });

        this.cacheStore.saveToFile("cache.json");
    }

    private applyTheme(theme: string) {
        const element = document.createElement('style');
        element.innerHTML = theme;
        document.head.appendChild(element);
    }
}
