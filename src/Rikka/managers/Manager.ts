import { Logger } from "@rikka/API/Utils";

/** Base class for all managers in Rikka */
export default class Manager {
  shutdown() {
    Logger.log(`${this.constructor.name} shutting down.`);
  }
}
