import { urls } from "@rikka/API/Constants";
import RikkaPlugin from "@rikka/Common/Plugin";

export default class RKBadges extends RikkaPlugin {
    Manifest = {
        name: "RKBadges",
        description: "Adds badge indicators to the Discord client",
        license: "MIT",
        dependencies: [],
        author: "V3L0C1T13S",
        version: "0.0.1",
    }

    inject() {
        this.fetchBadges();
    }

    private async addBadges() {
        
    }

    private async fetchBadges() {
        console.log("fetching");
        const res = await fetch(`http://${urls.RK_BACKEND_URL}/badges/@latest`);
        console.log(res);
    }
}
