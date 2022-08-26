import { Logger } from "@rikka/API/Utils";
import { readdirSync } from "fs";
import { join } from "path";

const coremods = readdirSync(__dirname)
  .filter((dir) => !dir.endsWith("index.js"))
  .map((mod) => require(join(__dirname, mod)));

const unloaders: Function[] = [];

export async function load() {
  coremods.forEach(async (mod) => {
    try {
      const unload = await mod();

      unloaders.push(unload);
    } catch (e) {
      Logger.error(`Error occurred during coremod load: ${e}`);
    }
  });
}

export function unload() {
  return Promise.all(unloaders.map((f) => f()));
}
