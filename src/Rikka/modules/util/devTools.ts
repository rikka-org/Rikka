import { BrowserWindow } from "electron";

export function DevToolsOpen(e: Electron.IpcMainInvokeEvent, opts: Electron.OpenDevToolsOptions, window: BrowserWindow) {
  e.sender.openDevTools(opts);
  if (window) {
    // @ts-ignore - Wrong wrong wrong
    const devWindow = new BrowserWindow({ webContents: e.sender.devToolsWebContents });
    devWindow.on("ready-to-show", () => devWindow.show());
    devWindow.on("close", () => {
      e.sender.closeDevTools();
      devWindow.destroy();
    });
  }
}

export function DevToolsClose(e: Electron.IpcMainInvokeEvent) {
  e.sender.closeDevTools();
}
