import RikkaPlugin from "@rikka/Common/Plugin";
import { createSetting } from "@rikka/API/settings";

// Another workaround for typescript not including .json by default
import manifest from "./manifest.json";

export default class SandboxPluginExample extends RikkaPlugin {
    Manifest = {
        name: "Sandbox Plugin",
        description: "A example of a sandboxed plugin",
        author: "V3L0C1T13S",
        version: "1.0.0",
        license: "MIT",
        dependencies: [],
    };

    inject(): void {
        const setting = createSetting("SandboxPluginExample");
        console.log(setting);
        console.log("done");
    }
}