import { log, err } from '@rikka/API/Utils/logger';
import React from '@rikka/API/pkg/React';
import { getModule } from "@rikka/API/webpack";
import RikkaPlugin from '@rikka/Common/entities/Plugin';
/** BS workaround for TS not including .json by default (Seriously, why is this not a default M$?) */
import * as pkg from './package.json';

export default class ExamplePlugin extends RikkaPlugin {
    Manifest = {
        name: "Webpack Test Plugin",
        description: "Test for Rikka's webpack modification system",
        author: "V3L0C1T13S",
        license: "BSD 3-Clause",
        version: pkg.version,
        dependencies: []
    }

    inject() {
        this.patchContextMenu();
    }

    private patchContextMenu(): NodeJS.Timeout | undefined {
        const contextMenuMod = getModule(
            (m: { default: { displayName: string; }; }) => m.default?.displayName === "MessageContextMenu"
        );

        log("getting menu");

        if (!contextMenuMod)
            return setTimeout(() => this.patchContextMenu(), 1000);
        
        log("got context menu");

        return;
    }
}
