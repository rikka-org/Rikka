import { Logger } from '@rikka/API/Utils/logger';
import RikkaPlugin from '@rikka/Common/entities/Plugin';
import manifest from "./manifest.json";

export default class ExamplePlugin extends RikkaPlugin {
    inject() {
        console.log("Injected!");

        // Make HTTP request to backend
        fetch('http://127.0.0.1:8000/badges/@latest', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
        .then(res => {
            return res.text();
        })
        .then(data => {
            Logger.log(`Backend response: ${data}`);
            return new Promise((resolve, reject) => {
                resolve(data ? JSON.parse(data) : {})
            })
        })
        .catch(errmsg => {
            Logger.error(`Failed to fetch badges: ${errmsg}`);
        });
    }
}
