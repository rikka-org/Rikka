import { BrowserWindow, LoadURLOptions } from "electron";

type urlCallback = (
    url: string,
    opts: LoadURLOptions, 
    window: BrowserWindow, 
    ogLoadUrl: (url: string, opts: LoadURLOptions) => void
) => void;

type URLRegister = {
    url: RegExp,
    callback: urlCallback,
}

export const urls: URLRegister[] = []

/** [MAIN ONLY] Register a URL callback, allows intercepting URLS early on.
 * @param callback The callback to call when the URL matches.
 * @param url The URL to match. Use this to maximize performance.
 */
export function registerURLCallback(callback: urlCallback, url: RegExp = /.*/) {
    urls.push({
        url: url,
        callback,
    });
}
