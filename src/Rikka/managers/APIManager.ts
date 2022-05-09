import { Logger } from "@rikka/API/Utils";
import { readdirSync } from "fs";
import { join } from "path";
import BaseAPI from "../API/BaseAPI";

/** Deprecated way of accessing APIs */
export default class APIManager {
  apiDirectory = join(__dirname, '..', '..', 'API');

  private loadedApis = new Map<string, BaseAPI>();

  apis = {};

  getAPI(api: string) {
    const apiModule = this.loadedApis.get(api);
    if (!apiModule) throw new Error(`Tried to fetch non-existant API ${api}`);

    return apiModule;
  }

  pushAPI(api: string) {
    try {
      const ApiModule = require(join(this.apiDirectory, api));
      // eslint-disable-next-line new-cap
      const apiInstance = new ApiModule.default();
      this.loadedApis.set(api, apiInstance);
      // @ts-ignore - This is literally supposed to be unsafe
      this.apis[api] = apiInstance;
    } catch (e) {
      Logger.error(e);
    }
  }

  loadAPIs() {
    readdirSync(this.apiDirectory).forEach((file) => {
      try {
        this.pushAPI(file);
      } catch (e) {
        Logger.error(`API loading error: ${e}`);
      }
    });
  }

  /** Shuts down the API manager */
  async _shutdown() {
    this.unloadAPIs();
  }

  private unloadAPIs() {
    this.loadedApis.forEach((api) => {
      api._unload();
    });
  }
}
