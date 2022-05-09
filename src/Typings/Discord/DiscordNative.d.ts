type Env = { [key: string]: string };

interface App {
    dock: Env;
  }

interface Os {
    release: string;
    arch: string;
}

interface Process {
    platform: string;
    arch: string;
    env: {};
}

interface NativeModules {
    canBootstrapNewUpdater: boolean;
}

declare module DiscordNative {
    const window: Window & {
        setDevtoolsCallbacks(callback: (() => void) | null, callback2: (() => void) | null): void;
        USE_OSX_NATIVE_TRAFFIC_LIGHTS: boolean;
    };
    const clipboard: {
        copy: (text: string) => void;
    };
    const isRenderer: boolean;
    const nativeModules: NativeModules;
    const process: Process;
    const os: Os;
    const app: App;
    const clipboard: Env;
    const ipc: Env;
    const gpuSettings: Env;
    const powerMonitor: Env;
    const pellCheck: Env;
    const crashReporter: Env;
    const desktopCapture: Env;
    const fileManager: Env;
    const processUtils: Env;
    const powerSaveBlocker: Env;
    const http: Env;
    const accessibility: Env;
    const features: Env;
    const settings: Env;
    const userDataCache: Env;
    const thumbar: Env;
    const safeStorage: Env;
    const remoteApp: App;
    const remotePowerMonitor: Env;
}
