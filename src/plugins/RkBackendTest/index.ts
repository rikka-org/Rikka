import RikkaPlugin from '@rikka/Common/Plugin';
/** BS workaround for TS not including .json by default (Seriously, why is this not a default M$?) */
import * as pkg from './package.json';

export default class ExamplePlugin extends RikkaPlugin {
    Manifest = {
        name: "Example Plugin",
        description: "Test for Rikka's web backend",
        author: "V3L0C1T13S",
        license: "BSD 3-Clause",
        version: pkg.version,
        dependencies: []
    }


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
            console.log(data);
            return new Promise((resolve, reject) => {
                resolve(data ? JSON.parse(data) : {})
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
}
