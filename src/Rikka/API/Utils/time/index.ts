import { err } from "../logger";

export async function sleep(ms: number) {
    try {
        return new Promise(resolve =>
            setTimeout(resolve, ms)
        );
    } catch (errmsg) {
        err("Failed to sleep: " + errmsg);
    }
}
