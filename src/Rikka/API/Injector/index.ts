/* eslint-disable func-names */
/** A function that injects the code of one function into a given function,
 * and runs it before the original function runs.
 * @param target The function to inject into.
 * @param injector The function to inject.
 * @param ogExec Whether to execute the original function or not.
 */
export function Prefix(target: Function, injector: Function, ogExec?: boolean) {
  return function (this: any, ...args: any[]) {
    injector.apply(this, args);
    if (ogExec) target.apply(this, args);
  };
}

/** Like Prefix, but it runs your code after the original code. */
export function Postfix(target: Function, injector: Function) {
  return function (this: any, ...args: any[]) {
    target.apply(this, args);
    injector.apply(this, args);
  };
}
