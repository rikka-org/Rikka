import { Logger } from "@rikka/API/Utils";
import { API } from "@rikka/Common/entities";

export default class Settings extends API {
  async startAPI() {
    Logger.log("started");
  }
}
