import { getCaller } from "@rikka/API/Utils/callerutils";
import { addMessage } from "./dmesg";

export class Logger {
    static rk_msg = `[Rikka]`;

    static log(...args: any[]) {
        const caller = getCaller(new Error().stack ?? "unknown");
        const msg = `[LOG] ${Logger.rk_msg}::${caller} ${args}`;

        console.log(msg);
        addMessage("LOG", msg);
    }

    static warn(...args: any[]) {
        const caller = getCaller(new Error().stack ?? "unknown");
        const msg = `[WARN] ${Logger.rk_msg}::${caller} ${args}`;

        console.warn(msg);
        addMessage("WARN", msg);
    }

    static error(...args: any[]) {
        const caller = getCaller(new Error().stack ?? "unknown");
        const msg = `[ERR] ${Logger.rk_msg}::${caller}, ${args}`

        console.error(msg);
        addMessage("ERR", msg);
    }

    static trace(...args: any[]) {
        const caller = getCaller(new Error().stack ?? "unknown");
        console.log(`[${this.rk_msg}]::[${caller}]`, ...args);
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
    let stack = error.stack;
    if (!stack) {
        stack = error.toString();
    }
    addMessage("STACKTRACE", stack);
    return stack;
}
