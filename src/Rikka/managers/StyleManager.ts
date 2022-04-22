import createHeadersHook from "@rikka/API/electron/headersHook";
import { Logger } from "@rikka/API/Utils";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";

export default class StyleManager {
    private themeDirectory = resolve(__dirname, '..', '..', 'themes');
    private loadedThemes: Map<string, string> = new Map();
    private availableThemes: string[] = [];

    private async loadThemes() {
        // TODO: Load themes

        const themes: string[] = [];
        readdirSync(this.themeDirectory).forEach(file => {
            try {
                const theme = readFileSync(resolve(this.themeDirectory, file)).toString();
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
