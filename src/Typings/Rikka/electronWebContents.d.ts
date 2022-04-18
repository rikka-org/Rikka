declare type WebContents = Electron.WebContents & {
    _rikkaPreload: string | undefined;
}