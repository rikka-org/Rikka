declare module Electron {
    interface BrowserWindow {
        webContents: Electron.WebContents & {
            _rikkaPreload: string | undefined;
        }
    }
}
