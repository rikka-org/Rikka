import { Logger } from '@rikka/API/Utils/logger';
import React from '@rikka/API/pkg/React';
import { ContextMenu } from '@rikka/API/components';
import { getModule } from "@rikka/API/webpack";
import RikkaPlugin from '@rikka/Common/entities/Plugin';
/** BS workaround for TS not including .json by default (Seriously, why is this not a default M$?) */
import * as pkg from './package.json';
import { patch } from '@rikka/API/patcher';
import menu from './components/menu';
import { Postfix, Prefix } from '@rikka/API/Injector';

export default class ExamplePlugin extends RikkaPlugin {
    Manifest = {
        name: "Webpack Test Plugin",
        description: "Test for Rikka's webpack modification system",
        author: "V3L0C1T13S",
        license: "BSD 3-Clause",
        version: pkg.version,
        dependencies: []
    }

    private contextMenu: any;

    inject() {
        this.patchContextMenu();
    }

    private patchContextMenu(): NodeJS.Timeout | undefined {
        this.contextMenu = getModule(
            (m: any) => m.default?.displayName === "MessageContextMenu"
        ) as any;

        Logger.log("getting menu");

        if (!this.contextMenu)
            return setTimeout(() => this.patchContextMenu(), 1000);
        
        Logger.log("got context menu");

        patch(this.contextMenu, "default", (args: any[], res: any) => {
            console.log("yoooo im injected wooooo");
        });

        return;
    }
}
