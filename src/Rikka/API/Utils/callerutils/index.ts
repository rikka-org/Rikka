export function getCaller() {
    const originalFunc = Error.prepareStackTrace;
    let caller: any;
    try {
        const err = new Error();
        Error.prepareStackTrace = (err, stack) => stack;
        const stack = err.stack;
        if (!stack) return 'unknown';
        Error.prepareStackTrace = originalFunc;
        caller = stack[1];
    } catch (e) {
        caller = 'unknown';
    }
    return caller;
}
