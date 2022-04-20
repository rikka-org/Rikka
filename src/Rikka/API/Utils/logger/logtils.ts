import { getCaller } from "@rikka/API/Utils/callerutils";
import { addMessage } from "./dmesg";

const rk_msg = `[Rikka]`;

export function log(...args: any[]) {
    const caller = getCaller();
    const msg = `[LOG] ${rk_msg}::${caller} ${args}`;

    console.log(msg);
    addMessage("LOG", msg);
}

export function warn(...args: any[]) {
    const caller = getCaller();
    const msg = `[WARN] ${rk_msg}::${caller} ${args}`;

    console.warn(msg);
    addMessage("WARN", msg);
}

export function err(...args: any[]) {
    const caller = getCaller();
    const msg = `[ERR] ${rk_msg}::${caller}, ${args}`

    console.error(msg);
    addMessage("ERR", msg);
}

export function stacktrace(error: Error): string {
    let stack = error.stack;
    if (!stack) {
        stack = error.toString();
    }
    addMessage("STACKTRACE", stack);
    return stack;
}
