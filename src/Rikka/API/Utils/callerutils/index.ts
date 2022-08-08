import { Logger } from "../logger";

type caller = {
  prettyName: string;
  name: string;
}

export function parseCallerFromStack(stack: string) {
  const caller = stack.split("\n")[2]?.trim();
  return caller?.substring(caller.indexOf("(") + 1, caller.indexOf(")"));
}

export function getCaller() {
  const { stack } = new Error();
  const caller = parseCallerFromStack(stack ?? "") ?? "unknown";

  return caller;
}

export const getCallerFile = (path: string) => {
  try {
    /**
       * If no path is provided, try to determine one with a forced error stack trace.
       */
    const stackTrace = (new Error()).stack;
    if (!stackTrace) return;

    return {
      id: 1,
    };
  } catch (err) {
    return Logger.error(err);
  }
};
