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
                console.error(`Theme loading error: ${e}`);
            }
        });

        return themes;
    }

    async applyThemes() {
        const themes = await this.loadThemes();
        this.availableThemes = themes;

        this.loadedThemes.forEach((theme, name) => {
            console.log(`Applying theme ${name}`);
            this.applyTheme(theme);
        });
    }

    private applyTheme(theme: string) {
        const element = document.createElement('style');
        element.innerHTML = theme;
        document.head.appendChild(element);

        console.log(`Theme applied`);
    }
}
