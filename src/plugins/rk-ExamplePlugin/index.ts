import { Store } from '@rikka/API/storage';
import { Logger } from '@rikka/API/Utils/logger';
import RikkaPlugin from '@rikka/Common/entities/Plugin';
/** BS workaround for TS not including .json by default (Seriously, why is this not a default M$?) */
import * as pkg from './package.json';

export default class ExamplePlugin extends RikkaPlugin {
    Manifest = {
        name: "Example Plugin",
        description: "An example plugin for Rikka.",
        author: "V3L0C1T13S",
        license: "BSD 3-Clause",
        version: pkg.version,
        dependencies: []
    }

    private store = new Store("ExamplePlugin");

    inject() {
        console.log("Example Plugin is starting...");

        this.store.set("test", "yo im a test");
        const d = this.store.get("test");

        this.store.set("randomTest", Math.random());
        const randtest = this.store.get("randomTest");
        console.log(`Random test: ${randtest}`);

        Logger.log(`Data: ${d}`);

        this.store.saveToFile(`test.json`);
    }

    private domInject() {
        const divNode = document.createElement("div");
        divNode.innerHTML = "<style>* { transition: 300ms cubic-bezier(0.22, 0.6, 0.12, 1.05); }</style>";
        document.head.appendChild(divNode);
    }
}
