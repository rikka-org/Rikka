export function clearCache(e: Electron.IpcMainInvokeEvent) {
  return new Promise((resolve) => {
    e.sender.session.clearCache().then(() => resolve(null));
  });
}
