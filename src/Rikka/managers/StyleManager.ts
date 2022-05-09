import Theme from "@rikka/Common/entities/Theme";
import { readdirSync } from "fs";
import { resolve } from "path";

export default class StyleManager {
  themes: Map<string, Theme> = new Map();

  private static readonly themesDirectory = resolve(__dirname, "..", "..", "themes");

  _applyTheme(name: string) {
    const theme = this.themes.get(name);
    theme?._load();
  }

  _removeTheme(theme: Theme) {
    theme._unload();
  }

  _loadTheme(filename: string, themeDirectory: string) {
    const theme = new Theme(themeDirectory);
    this.themes.set(theme.themeManifest?.name ?? filename, theme);
  }

  _loadThemes() {
    readdirSync(StyleManager.themesDirectory).filter((file) => !file.endsWith(".exists")).forEach((file) => {
      const filePath = resolve(StyleManager.themesDirectory, file);
      this._loadTheme(file, filePath);
    });
  }

  _applyThemes() {
    this.themes.forEach((theme) => {
      theme._load();
    });
  }
}
