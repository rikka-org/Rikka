import { Constructable } from "@rikka/API/typings";
import { Logger } from "@rikka/API/Utils";
import { API } from "@rikka/Common/entities";
import { readdirSync } from "fs";
import { join } from "path";
import Manager from "./Manager";

export class APIManager extends Manager {
  private apiDir = join(__dirname, "..", "RKApi");

  private apis: string[] = [];

  mountApi(api: string) {
    try {
      const ApiClass: Constructable<API> = require(join(this.apiDir, api)).default;
      const apiName = api.replace(/\.js$/, "");
      $rk.api[apiName] = new ApiClass();
      this.apis.push(apiName);
    } catch (e) {
      Logger.error(`Could not find API ${api}\n${e}`);
    }
  }

  async load() {
    // eslint-disable-next-line no-restricted-syntax
    for (const api of this.apis) {
      // eslint-disable-next-line no-await-in-loop
      await $rk.api[api]?._load();
    }
  }

  async unload() {
    // eslint-disable-next-line no-restricted-syntax
    for (const api of this.apis) {
      // eslint-disable-next-line no-await-in-loop
      await $rk.api[api]?._unload();
    }
  }

  async init() {
    readdirSync(this.apiDir)
      .forEach((file) => this.mountApi(file));
    await this.load();
  }
}
