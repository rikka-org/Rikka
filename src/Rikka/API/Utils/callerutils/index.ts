export function getCaller(stack: string) {
    const caller = stack.split("\n")[2]?.trim();
    return caller?.substring(caller.indexOf("(") + 1, caller.indexOf(")"));
}