import { join } from "path";

export default class APIManager {
    apiDirectory = join(__dirname, '..', '..', 'API');
    loadedApis = new Set();

    pushAPIs() {
        
    }
    async loadAPIs() {

    }
}
