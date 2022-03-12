import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import Logger from "../../Common/Logger";

export default class APIManager {
    private apiDir = join(__dirname, '..', 'API');
    apis = new Array<any>();

    mount(filename: string) {
        try {
            Logger.trace(`Mounting API ${filename}`);
            const apiClass = require(resolve(this.apiDir, filename));
            const api = filename.replace(/\.js$/, '');
            powercord.api[api] = new apiClass();

            this.apis.push(api);
        } catch (e) {
            Logger.trace(`Failed to mount API: ${filename}. ${e}`);
        }
    }

    async load() {
        for (const api of this.apis) {
            await powercord.api[api]._load();
        }
    }

    async unload() {
        for (const api of this.apis) {
            await powercord.api[api]._unload();
        }
    }

    async startAPIs() {
        readdirSync(this.apiDir)
            .filter(f => statSync(join(this.apiDir, f)).isFile())
            .forEach(filename => this.mount(filename));
        await this.load();
    }
}
