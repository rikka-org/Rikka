import { readdirSync } from "fs";
import { join } from "path";
import BaseAPI from "../API/BaseAPI";

export default class APIManager {
    apiDirectory = join(__dirname, '..', '..', 'API');
    private loadedApis = new Map<string, BaseAPI>();
    apis = {};

    getAPI(api: string) {
        const apiModule = this.loadedApis.get(api);
        if(!apiModule) throw new Error(`Tried to fetch non-existant API ${api}`);
        
        return apiModule;
    }

    pushAPI(api: string) {
        try {
            const apiModule = require(join(this.apiDirectory, api));
            const apiInstance = new apiModule.default();
            this.loadedApis.set(api, apiInstance);
            //@ts-ignore - This is literally supposed to be unsafe
            this.apis[api] = apiInstance
        } catch (e) {
            console.error(e);
        }
    }

    loadAPIs() {
        readdirSync(this.apiDirectory).forEach(file => {
            try {
                this.pushAPI(file)
            } catch (e) {
                console.error(`API loading error: ${e}`);
            }
        });
    }
}
