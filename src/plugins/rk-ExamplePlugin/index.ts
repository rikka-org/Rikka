import { Store } from "@rikka/API/storage";
import { Logger } from "@rikka/API/Utils/logger";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
/** You have to do this or the compiler refuses to include JSON */
import manifest from "./manifest.json";

export default class ExamplePlugin extends RikkaPlugin {
  private store = new Store("ExamplePlugin");

  inject() {
    Logger.log("Example Plugin is starting...");

    this.store.set("test", "yo im a test");
    const d = this.store.get("test");

    this.store.set("randomTest", Math.random());
    const randtest = this.store.get("randomTest");
    Logger.log(`Random test: ${randtest}`);

    Logger.log(`Data: ${d}`);

    this.store.saveToFile(`test.json`);
  }

  private domInject() {
    const divNode = document.createElement("div");
    divNode.innerHTML = "<style>* { transition: 300ms cubic-bezier(0.22, 0.6, 0.12, 1.05); }</style>";
    document.head.appendChild(divNode);
  }
}
