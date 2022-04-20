import { log } from '@rikka/API/Utils';
import { owoifyText } from '@rikka/API/Utils/strings/owoify';
import RikkaPlugin from '@rikka/Common/entities/Plugin';
import * as pkg from './package.json';

export default class ExamplePlugin extends RikkaPlugin {
    Manifest = {
        name: "owocord",
        description: "makes your discord cute :3",
        author: "V3L0C1T13S",
        license: "BSD 3-Clause",
        version: pkg.version,
        dependencies: []
    }

    inject() {
        log("owo");

        document.body.addEventListener("DOMNodeInserted", (event) => {
            this.recurse(event.target);
        });
        this.recurse(document.body);
    }

    private recurse(node: any) {
        if (
            ["STYLE", "SCRIPT", "NOSCRIPT", "IFRAME", "OBJECT"].includes(node.tagName)
        )
            return;
        for (let child of node.childNodes) {
            this.recurse(child);
        }
        if (node.nodeType === 3 && node.nodeValue != null) {
            node.nodeValue = owoifyText(node.nodeValue);
        }
    }
}
