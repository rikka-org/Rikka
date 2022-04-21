import { escapeRegExp } from "lodash";
import { Logger } from "../logger";

export function getCaller(stack: string) {
    const caller = stack.split("\n")[2]?.trim();
    return caller?.substring(caller.indexOf("(") + 1, caller.indexOf(")"));
}

export const getCallerFile = (path: string) => {
    try {
      /**
       * If no path is provided, try to determine one with a forced error stack trace.
       */
      const stackTrace = (new Error()).stack;
      if (!stackTrace) return;

      return {
          id: 1
      }
    } catch (err) {
      Logger.error(err);
      return;
    }
  };