import { API } from "@rikka/Common/entities";
import Settings from "./settings";

export type RKApiTypings = {
  [key: string]: API;

  settings: Settings,
}
