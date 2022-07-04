type Env = { [key: string]: string };

interface App {
    dock: Env;
    getDefaultDoubleClickAction: () => string;
    getModuleVersions: () => Env;
    getPath: () => string;
    getReleaseChannel: () => string;
    getVersion: () => string;
    registerUserInteractionHandler: (handler: () => void) => void;
    relaunch: (args?: string[]) => void;
    setBadgeCount: (count: number) => void;
}

interface Accessibility {
    isAccessibilitySupportEnabled: () => boolean;
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

type crashReportMetadata = {
    user_id: string;
}

interface Clipboard {
    copy: (text: string) => void;
    copyImage: (image: string) => void;
    cut: (text: string) => void;
    paste: () => string;
    read: () => string;
}

interface CrashReporter {
    getMetadata: () => crashReportMetadata;
    updateCrashReporter: () => void;
}

interface DesktopCapture {
    getDesktopCapturerSources: () => any;
}

interface features {
    declareSupported: () => void;
    supports: (feature: string) => boolean;
}

interface GpuSettings {
    getEnableHardwareAcceleration: () => boolean;
    setEnableHardwareAcceleration: (enable: boolean) => void;
}

interface http {
    getAPIEndpoint: () => string;
    // FIXME most likely incorrect - couldnt get much info on this
    makeChunkedRequest: (
        method: string,
        url: string,
        headers: { [key: string]: string },
        body: string,
        onProgress: (progress: number) => void,
        onResponse: (response: string) => void,
        onError: (error: string) => void,
    ) => void;
}

interface ipc {
    invoke: (...args: any[]) => void;
    on: (...args: any[]) => void;
    send: (...args: any[]) => void;
}

interface nativeModules {
    canBootstrapNewUpdater: boolean;
    ensureModule: (module: string) => void;
    requireModule: (module: string) => any;
}

interface powerMonitor {
    getSystemIdleTimeMs: () => number;
    on: (...args: any[]) => void;
    removeAllListeners: (...args: any[]) => void;
    removeListener: (...args: any[]) => void;
}

interface powerSaveBlocker {
    blockDisplaySleep: () => void;
    cleanupDisplaySleep: () => void;
    unblockDisplaySleep: () => void;
}

declare module DiscordNative {
    const window: Window & {
        setDevtoolsCallbacks(callback: (() => void) | null, callback2: (() => void) | null): void;
        USE_OSX_NATIVE_TRAFFIC_LIGHTS: boolean;
        // FIXME
        blur: (...args: any[]) => void;
        close: () => void;
        flashFrame: (...args: any[]) => void;
        focus: (...args: any[]) => void;
        fullscreen: (...args: any[]) => void;
        isAlwaysOnTop: () => boolean;
        maximize: (...args: any[]) => void;
        minimize: (...args: any[]) => void;
        restore: (...args: any[]) => void;
        setAlwaysOnTop: (...args: any[]) => void;
        setBackgroundThrottling: (...args: any[]) => void;
        setProgressBar: (...args: any[]) => void;
        setZoomFactor: (...args: any[]) => void;
    };
    const isRenderer: boolean;
    const nativeModules: NativeModules;
    const process: Process;
    const os: Os;
    const app: App;
    const clipboard: Clipboard;
    const ipc: ipc;
    const gpuSettings: GpuSettings;
    const powerMonitor: powerMonitor;
    const spellCheck: Env;
    const crashReporter: CrashReporter;
    const desktopCapture: DesktopCapture;
    const fileManager: Env;
    const processUtils: Env;
    const powerSaveBlocker: powerSaveBlocker;
    const http: http;
    const accessibility: Accessibility;
    const features: features;
    const settings: Env;
    const userDataCache: Env;
    const thumbar: Env;
    const safeStorage: Env;
    const remoteApp: App;
    const remotePowerMonitor: Env;
}
