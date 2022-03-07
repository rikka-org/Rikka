import StyleManager from "./managers/StyleManager";

export class Rikka {
    private styleManager = new StyleManager();

    constructor() {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', () => this.start());
        else
            this.start();
    }

    private async start() {

    }

    private async rikkaStartup() {
        this.styleManager.loadThemes();
    }
}