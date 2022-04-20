import Logger from "../../../Common/Logger";
import Constants from "../constants";
import https from "https";
import http from "http";
import querystring from "querystring";
import url from "url";

interface genericRequestOpts extends RequestInit {
    uri: string;
    query: any;
    data?: string;
}

class HTTPError extends Error {
    name: string = this.constructor.name;

    constructor(message: string, res: Response) {
        super(message);
        Object.assign(this, res);
    }
}

export = class GenericRequest {
    opts: genericRequestOpts;
    private _res?: any;

    constructor(method: string, uri: string) {
        this.opts = {
            method,
            uri,
            query: {},
            headers: {
                'User-Agent': `Powercord (https://github.com/${Constants.REPO_URL})`
            }
        }
    }

    private _objectify(key: any, value: any) {
        return key instanceof Object
            ? key
            : { [key]: value };
    }

    query(key: any, value: any) {
        this.opts.query = {
            ...this.opts.query,
            ...this._objectify(key, value)
        };
        return this;
    }

    set(key: any, value: any) {
        this.opts.headers = {
            ...this.opts.headers,
            ...this._objectify(key, value)
        };
        return this;
    }

    send(body: any) {
        if (body instanceof Object)
            this.opts.data = JSON.stringify(body);
        else
            this.opts.data = body;

        return this;
    }

    then(resolver: any, rejector: any) {
        if (this._res) {
            return this._res.then(resolver, rejector);
        }

        return (
            this._res = this.execute().then(resolver, rejector)
        );
    }

    catch(rejector: any) {
        return this.then(null, rejector);
    }

    execute() {
        return new Promise((resolve, reject) => {
            // Clone our opts
            const opts = { ...this.opts };
            const { request } = opts.uri.startsWith('https')
                ? https
                : http;

            if (Object.keys(opts.query)[0]) {
                opts.uri += `?${querystring.encode(opts.query)}`;
            }

            //@ts-ignore
            const options = Object.assign({}, opts, url.parse(opts.uri), { ca: certificates });

            // Make the request
            const req = request(options as any, (res) => {
                const data: Uint8Array[] = [];
                res.on('data', (chunk) => data.push(chunk));
                res.once('error', reject);
                res.once('end', () => {
                    const raw = Buffer.concat(data);

                    const result = {
                        raw,
                        body: (() => {
                            if ((/application\/json/).test((res.headers as any)['content-type'])) {
                                try {
                                    return JSON.parse(raw.toString());
                                } catch (_) {
                                    return raw;
                                }
                            }
                        })(),
                        headers: res.headers,
                        ok: res.statusCode! >= 200 && res.statusCode! < 300,
                        statusText: res.statusMessage,
                        statusCode: res.statusCode,
                    }

                    if (result.ok)
                        resolve(result);
                    else
                        reject(new HTTPError(`${res.statusCode} ${res.statusMessage}`, result as any));
                });

                req.once('error', reject);

                if (opts.data)
                    req.write(opts.data);

                req.end();
            })
        });
    }
}
