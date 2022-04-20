const { resolveCompiler } = require('powercord/compilers');
const { createElement } = require('powercord/util');

import Updatable from "./Updatable";

export = class Theme extends Updatable {
    compiler: any;
    manifest: any;
    applied: boolean;

    private style: HTMLElement = createElement('style', {
        id: `theme-${this.entityID}`,
        'data-powercord': true,
        'data-theme': true
    });

    constructor(themeID: string | undefined, manifest: any) {
        const styleManager: any = typeof powercord !== 'undefined' ? powercord.styleManager : global.sm;
        super((styleManager).themesDir, themeID);

        this.compiler = resolveCompiler(manifest.effectiveTheme);
        this.manifest = manifest;
        this.applied = false;
    }

    private async _doCompile() {
        this.style.innerHTML = await this.compiler.compile();
    }

    apply() {
        if (!this.applied) {
            this.applied = true;
            document.head.appendChild(this.style);

            this.compiler.enableWatcher();
            this.compiler.on('src-update', this._doCompile);
            return this._doCompile();
        }

        return;
    }

    remove() {
        if (this.applied) {
            this.applied = false;
            this.compiler.off('src-update', this._doCompile);
            document.getElementById(`theme-${this.entityID}`)?.remove();
            this.compiler.disableWatcher();
        }
    }
}