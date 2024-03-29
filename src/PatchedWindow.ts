import { join } from "path";
import { BrowserWindow, BrowserWindowConstructorOptions, LoadURLOptions } from "electron";
import { IPC_Consts } from "@rikka/API/Constants";
import { urls } from "@rikka/modules/browserWindowtils";

export default class PatchedWindow extends BrowserWindow {
  // @ts-ignore
  constructor(options: BrowserWindowConstructorOptions) {
    let originalPL;
    // Some random Discord dark magic
    // @ts-ignore
    if (options.webContents) {
      // no idea what the hell this is for
    } else if (options.webPreferences && options.webPreferences.nodeIntegration) {
      // Preload splash screen
      options.webPreferences.preload = join(__dirname, "preloadSplash.js");
    } else if (options.webPreferences && options.webPreferences.offscreen) {
      // Ingame overlay
      originalPL = options.webPreferences.preload;
    } else if (options.webPreferences && options.webPreferences.preload) {
      originalPL = options.webPreferences.preload;
      // @ts-ignore
      if (options.webPreferences.nativeWindowOpen) {
        // Stupid workaround
        options.webPreferences.contextIsolation = false;
        options.webPreferences.preload = join(__dirname, "preload.js");
        // MacOS splash screen
      } else { options.webPreferences.preload = join(__dirname, "preloadSplash.js"); }
    }

    const BWindow = new BrowserWindow(options);
    const ogloadURL = BWindow.loadURL.bind(BWindow);
    Object.defineProperty(BWindow, "loadURL", {
      get: () => PatchedWindow.loadURL.bind(BWindow, ogloadURL),
      configurable: true,
    });

    BWindow.on("maximize", () => BWindow.webContents.send(IPC_Consts.IPC_MAXIMIZE));
    BWindow.on("unmaximize", () => BWindow.webContents.send(IPC_Consts.IPC_UNMAXIMIZE));

    (BWindow.webContents as any)._rikkaPreload = originalPL;

    return BWindow;
  }

  static loadURL(ogLoadUrl: (url: string, opts: LoadURLOptions) => void, url: string, opts: LoadURLOptions) {
    urls.forEach((urlRegister) => {
      urlRegister.callback(url, opts, this as any, ogLoadUrl);
    });

    return ogLoadUrl(url, opts);
  }
}
