import { join } from "path";

export default class APIManager {
    apiDirectory = join(__dirname, '..', '..', 'API');
    private loadedApis = new Set();

    pushAPI(api: string) {
        try {
            const apiModule = require(join(this.apiDirectory, api));
            this.loadedApis.add(apiModule);
        } catch (e) {
            console.error(e);
        }
    }

    async loadAPIs() {

    }
}
