import { createElement } from "@rikka/API/Utils/DOM";
import { getCompiler } from "@rikka/modules/compilers";
import Compiler from "@rikka/modules/compilers/compiler";
import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { startCase } from "lodash";
import { powercordManifest, rikkaManifest, vizalityManifest } from "./typings/manifestTypes";
import Updatable from "../Updatable";

type manifestTypes = powercordManifest | vizalityManifest | rikkaManifest;

export default class Theme extends Updatable {
  cssCode?: string;

  private file: string;

  private compiler: Compiler;

  applied = false;

  enabled: boolean = false;

  private htmlElement?: HTMLStyleElement;

  type = "theme";

  themeManifest?: manifestTypes;

  constructor(file: string) {
    super();

    if (statSync(file).isDirectory()) {
      // We can assume this has at least one manifest type
      const potentialManifests = [
        "powercord_manifest.json",
        "manifest.json",
        "rikka_manifest.json",
      ];

      const manifestFile = potentialManifests.find((manifest) => existsSync(join(file, manifest)));
      if (manifestFile) {
        this.themeManifest = JSON.parse(readFileSync(join(file, manifestFile), "utf8")) as manifestTypes;

        if (window.__SPLASH__ && this.themeManifest.splashTheme) {
          this.file = join(file, this.themeManifest.splashTheme);
        } else this.file = join(file, this.themeManifest.theme);
      } else {
        this.file = "";
      }
    } else this.file = file;

    this.path = file;

    const Compiler = getCompiler(this.file);
    this.compiler = new Compiler(this.file);

    this.id = this.themeManifest?.name ?? file.split("/").pop() ?? this.constructor.name;
  }

  async _load() {
    if (this.applied) return;

    this.applied = true;
    this.enabled = true;

    this.cssCode = this.compiler.doCompilation();
    const style = createElement("style", {
      id: `${this.type}-${this.id}`,
      "rk-style": true,
      [`rk-${this.type}`]: true,
    }) as HTMLStyleElement;
    style.innerHTML = this.cssCode;
    document.head.appendChild(style);

    this.htmlElement = style;
  }

  _unload() {
    if (!this.applied || !this.htmlElement) return;

    document.head.removeChild(this.htmlElement);
    this.applied = false;
    this.enabled = false;
  }
}
