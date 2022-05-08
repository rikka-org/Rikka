declare module DiscordNative {
    var window: Window & {
        setDevtoolsCallbacks(callback: (() => void) | null, callback2: (() => void) | null): void;
    };
    const clipboard: {
        copy: (text: string) => void;
    };
}