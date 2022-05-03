import Theme from "@rikka/Common/entities/Theme";
import { readdirSync } from "fs";
import { resolve } from "path";

export default class StyleManager {
    themes: Map<string, Theme> = new Map();
    private themesDirectory = resolve(__dirname, "..", "..", "themes");

    removeTheme(theme: Theme) {
        theme._unload();
    }

    loadThemes() {
        readdirSync(this.themesDirectory).filter(file => !file.endsWith(".exists")).forEach(file => {
            const filePath = resolve(this.themesDirectory, file);

            const theme = new Theme(filePath);
            this.themes.set(file, theme);
        });
    }

    applyThemes() {
        this.themes.forEach(theme => {
            theme._load();
        });
    }
}