import { BrowserWindow, BrowserWindowConstructorOptions, LoadURLOptions } from "electron";
import { join } from "path";
import { IPC_Consts } from "./API/Rikka/Constants/IPC_Consts";

export class PatchedWindow extends BrowserWindow {
    constructor(options: BrowserWindowConstructorOptions) {
        super(options);
        console.log("Loading patched window");

        let originalPL;

        if (options.webPreferences && options.webPreferences.nodeIntegration) {
            options.webPreferences.preload = join(__dirname, "preloadSplash.js");
        } else if (options.webPreferences && options.webPreferences.offscreen) {
            originalPL = options.webPreferences.preload;
        } else if (options.webPreferences && options.webPreferences.preload) {
            originalPL = options.webPreferences.preload;
            if (options.webPreferences.nativeWindowOpen) {
                // Stupid workaround
                options.webPreferences.contextIsolation = false;
                options.webPreferences.preload = join(__dirname, "preload.js");
            } else
                options.webPreferences.preload = join(__dirname, "preloadSplash.js");
        }

        const BWindow = new BrowserWindow(options);
        const ogloadURL = BWindow.loadURL.bind(BWindow);
        Object.defineProperty(BWindow, "loadURL", {
            configurable: true,
            get: () => PatchedWindow.loadURL.bind(BWindow, ogloadURL)
        });

        BWindow.on("maximize", () => BWindow.webContents.send(IPC_Consts.IPC_MAXIMIZE));
        BWindow.on("unmaximize", () => BWindow.webContents.send(IPC_Consts.IPC_UNMAXIMIZE));

        (BWindow.webContents as WebContents)._rikkaPreload = originalPL;

        return BWindow;
    }

    static loadURL(ogLoadUrl: any, url: string, opts: LoadURLOptions) {
        return ogLoadUrl(url, opts);
    }
} 