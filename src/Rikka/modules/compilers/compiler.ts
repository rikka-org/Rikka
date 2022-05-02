import { Store } from "@rikka/API/storage";
import { Logger } from "@rikka/API/Utils";
import Events from "events";
import { statSync } from "fs";

export default abstract class Compiler extends Events {
    static readonly extensions: string[];

    protected abstract compile(): any;

    protected file: string;
    watchEnabled: boolean = false;

    private cacheStore = new Store("rk-compiler");

    protected _watchers: { [key: string]: any } = {};

    protected filename: string;

    constructor(file: string) {
        super();

        this.file = file;

        this.filename = file.replace(/\\/g, "/").split("/").pop() ?? "";

        this.cacheStore.loadFromFile(`${this.filename}.json`);
    }

    watch() {
        this.watchEnabled = true;
    }

    unwatch() {
        this.watchEnabled = false;
        Object.values(this._watchers).forEach(w => w.close());
        this._watchers = {};
    }

    doCompilation() {
        let res: string;

        const cached = this.getCached();
        const modifiedTime = this.cacheStore.get("mtime");
        const fileModifiedTime = statSync(this.file).mtime.getTime();
        if (cached && modifiedTime === fileModifiedTime) {
            Logger.log(`Using cached version of ${this.filename}`);
            res = cached;
        } else {
            res = this.compile();
            this.cacheStore.set("content", res);
            this.cacheStore.set("mtime", new Date());
        }

        this.cacheStore.saveToFile(`${this.filename}.json`);

        return res;
    }

    private getCached() {
        return this.cacheStore.get("content");
    }
}