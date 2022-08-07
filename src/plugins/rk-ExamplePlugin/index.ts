import { Store } from "@rikka/API/storage";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
/** You have to do this or the compiler refuses to include JSON */
import manifest from "./manifest.json";

export default class ExamplePlugin extends RikkaPlugin {
  inject() {
    this.log("Example Plugin is starting...");

    this.settings.set("test", "yo im a test");
    const d = this.settings.get("test");

    this.settings.set("randomTest", Math.random());
    const randtest = this.settings.get("randomTest");
    this.log(`Random test: ${randtest}`);

    this.log(`Data: ${d}`);

    this.settings.saveToFile(`test.json`);
  }

  /* private domInject() {
    const divNode = document.createElement("div");
    divNode.innerHTML = "<style>* { transition: 300ms cubic-bezier(0.22, 0.6, 0.12, 1.05); }</style>";
    document.head.appendChild(divNode);
  } */
}
