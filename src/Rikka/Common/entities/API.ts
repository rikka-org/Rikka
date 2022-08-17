/* eslint-disable no-empty-function */
import { Logger } from "@rikka/API/Utils";
import Events from "events";

export abstract class API extends Events {
  ready = false;

  async _load() {
    try {
      await this.startAPI();
      this.ready = true;
    } catch (e) {
      Logger.error(`Could not start API ${this.constructor.name}\n${e}`);
    }
  }

  async _unload() {
    try {
      await this.unloadAPI();
      this.ready = false;
    } catch (e) {
      Logger.error(`Could not unload API ${this.constructor.name}\n${e}`);
    }
  }

  abstract startAPI(): Promise<void>;

  async unloadAPI() {}
}
