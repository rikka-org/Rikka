import RikkaPlugin from "@rikka/Common/Plugin";

type ChromeMediaDevices = MediaDevices & {
    chromiumGetDisplayMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
};

export default class LinuxAudioClass extends RikkaPlugin {
    Manifest = {
        name: "LinuxAudioStreaming",
        author: "V3L0C1T13S",
        version: "1.0.0",
        description: "Linux Audio Streaming Plugin",
        dependencies: [],
        license: "MIT",
    };

    inject(): void {
        
    }

    private async getDisplayMedia() {
        (navigator as any).mediaDevices.chromiumGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        let captureSystemAudioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                // We add our audio constraints here, to get a list of supported constraints use navigator.mediaDevices.getSupportedConstraints();
                // We must capture a microphone, we use default since its the only deviceId that is the same for every Chromium user
                deviceId: { exact: "default" },
                // We want auto gain control, noise cancellation and noise suppression disabled so that our stream won't sound bad
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: false
                // By default Chromium sets channel count for audio devices to 1, we want it to be stereo in case we find a way for Discord to accept stereo screenshare too
                //channelCount: 2,
                // You can set more audio constraints here, below are some examples
                //latency: 0,
                //sampleRate: 48000,
                //sampleSize: 16,
                //volume: 1.0
            }
        });
        let [track] = captureSystemAudioStream.getAudioTracks();
        const gdm = await (navigator as any).mediaDevices.chromiumGetDisplayMedia({
            video: true,
            audio: true
        });
        gdm.addTrack(track);
        return gdm;
    }
}