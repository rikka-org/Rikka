import { join } from "path";
import { BrowserWindow, BrowserWindowConstructorOptions, LoadURLOptions } from "electron";
import { IPC_Consts } from "./Rikka/API/Constants";

export default class PatchedWindow extends BrowserWindow {
    //@ts-ignore
    constructor(options: BrowserWindowConstructorOptions) {
        let originalPL;
        // Some random Discord dark magic
        //@ts-ignore
        if (options.webContents) {
            // no idea what the hell this is for
        } else if (options.webPreferences && options.webPreferences.nodeIntegration) {
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

        // Used to enable Wayland Streaming on Linux
        if (process.platform === "linux" && options.webPreferences) {
            options.webPreferences.ozoneplatformhint = "wayland";
            options.webPreferences.enablewebrtcpipewirecapturer = true;
        }

        const BWindow = new BrowserWindow(options);
        const ogloadURL = BWindow.loadURL.bind(BWindow);
        Object.defineProperty(BWindow, "loadURL", {
            get: () => PatchedWindow.loadURL.bind(BWindow, ogloadURL),
            configurable: true,
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
