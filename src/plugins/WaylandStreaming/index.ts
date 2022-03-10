import { RikkaPlugin } from "../../Common/Plugin";
import { IPC_Consts } from "../../Rikka/API/Constants";
import { app } from "electron";

export default class WaylandStreaming extends RikkaPlugin {
    Manifest = {
        name: "Wayland Streaming",
        description: "Enables Wayland Streaming in Discord",
        author: "V3L0C1T13S",
        version: "1.0.0",
        license: "MIT",
        dependencies: []
    }

    inject() {
        //this.enableWaylandStreaming();
    }

    private enableWaylandStreaming() {
        // We need to change Chromium flags to enable Wayland Streaming
        // This is done by calling app.commandLine.appendSwitch
        app.commandLine.appendSwitch("enable-webrtc-pipewire-capturer");
    }
}
