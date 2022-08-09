/* eslint-disable no-plusplus */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-setter-return */
/* eslint-disable no-return-assign */
import { webFrame } from "electron";

export function setGlobal(key: string, main: boolean = false) {
  Object.defineProperty(main ? (webFrame as any).top?.context : window, key, {
    get: () => (main ? window : (webFrame as any).top?.context)[key],
    set: (v) => (main ? window : (webFrame as any).top?.context)[key] = v,
  });
}
