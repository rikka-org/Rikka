import { Logger } from "../logger";

export async function sleep(ms: number) {
  try {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
  } catch (errmsg) {
    Logger.error(`Failed to sleep: ${errmsg}`);
  }
}
