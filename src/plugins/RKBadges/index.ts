import RikkaPlugin from "@rikka/Common/Plugin";
import { RK_API_URL } from "./constants";

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

    }

    private async addBadges() {
        
    }

    private async fetchBadges() {
        const res = await fetch(`${RK_API_URL}/badges`);
        const data = await res.json();
        return data;
    }
}