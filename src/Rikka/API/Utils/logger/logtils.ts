import { getCaller } from "@rikka/API/Utils/callerutils";

const rk_msg = `[Rikka]`;

export function log(...args: any[]) {
    const caller = getCaller();

    console.log(`[LOG] ${rk_msg}::${caller}`, ...args);
}

export function warn(...args: any[]) {
    const caller = getCaller();

    console.warn(`[WARN] ${rk_msg}::${caller}`, ...args);
}

export function err(...args: any[]) {
    const caller = getCaller();

    console.error(`[ERR] ${rk_msg}::${caller}`, ...args);
}

export function stacktrace(error: Error): string {
    let stack = error.stack;
    if (!stack) {
        stack = error.toString();
    }
    return stack;
}