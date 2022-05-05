import { Logger } from '@rikka/API/Utils/logger';
import RikkaPlugin from '@rikka/Common/entities/Plugin';
import manifest from "./manifest.json";

type badge = {
    text: string;
    color: string;
    icon: string;
    uid: string;
};

export default class ExamplePlugin extends RikkaPlugin {

    private badges: badge[] = [];

    inject() {
        this.fetchBadges();
    }

    private async fetchBadges() {
        const badges = await fetch("http://127.0.0.1:8000/badges/@latest").catch(err => {
            Logger.error(`Failed to fetch badges: ${err}`);
        });
    }
}
