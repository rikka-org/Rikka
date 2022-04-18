export function stacktrace(error: Error): string {
    let stack = error.stack;
    if (!stack) {
        stack = error.toString();
    }
    return stack;
}
