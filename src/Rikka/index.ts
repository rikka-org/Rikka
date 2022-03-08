import StyleManager from "./managers/StyleManager";

export default class Rikka {
    private styleManager = new StyleManager();

    constructor() {
        if (document.readyState === 'loading')
            document.addEventListener('DOMContentLoaded', () => this.start());
        else
            this.start();
    }

    private async start() {
        this.rikkaStartup();
        this.testDomMod();
    }

    private testDomMod() {
        console.log("Testing dom mod");
        const node = document.createElement("div");
        node.innerHTML = "Hello world";
        document.body.appendChild(node);
    }

    private async rikkaStartup() {
        this.styleManager.loadThemes();
    }
}
