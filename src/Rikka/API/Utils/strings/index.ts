export * from "./owoify";

export function appendDate(str: string) {
  return `[${new Date().toLocaleString()}]: ${str}`;
}
