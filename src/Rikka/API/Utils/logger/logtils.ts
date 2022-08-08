/* eslint-disable no-console */
import { getCaller } from "@rikka/API/Utils/callerutils";
import { appendDate } from "../strings";
import { addMessage } from "./dmesg";

export class Logger {
  static rk_msg = `[Rikka]`;

  static log(...args: any[]) {
    const caller = getCaller();
    const msg = appendDate(`[LOG] ${Logger.rk_msg}::${caller} ${args}`);

    console.log(msg);
    addMessage("LOG", msg);
  }

  static warn(...args: any[]) {
    const caller = getCaller();
    const msg = appendDate(`[WARN] ${Logger.rk_msg}::${caller} ${args}`);

    console.warn(msg);
    addMessage("WARN", msg);
  }

  static error(...args: any[]) {
    const caller = getCaller();
    const msg = appendDate(`[ERR] ${Logger.rk_msg}::${caller}, ${args}`);

    try {
      console.error(msg);
      addMessage("ERR", msg);
    } catch (e) {
      addMessage("ERR", "Something went horribly wrong");
    }
  }

  static trace(...args: any[]) {
    const caller = getCaller();
    console.log(appendDate(`[${this.rk_msg}]::[${caller}]`), ...args);
  }
}

export function log(...args: any[]) {
  Logger.log(...args);
}

export function warn(...args: any[]) {
  Logger.warn(...args);
}

export function err(...args: any[]) {
  Logger.error(...args);
}

export function stacktrace(error: Error): string {
  let { stack } = error;
  if (!stack) {
    stack = error.toString();
  }
  addMessage("STACKTRACE", stack);
  return stack;
}
