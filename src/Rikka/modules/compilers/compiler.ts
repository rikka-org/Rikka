import Events from "events";

export default abstract class Compiler extends Events {
    static readonly extensions: string[];

    protected abstract compile(): any;

    protected file: string;
    watchEnabled: boolean = false;

    protected _watchers: { [key: string]: any } = {};

    constructor(file: string) {
        super();

        this.file = file;
    }

    watch() {
        this.watchEnabled = true;
    }

    unwatch() {
        this.watchEnabled = false;
        Object.values(this._watchers).forEach(w => w.close());
        this._watchers = {};
    }

    doCompilation(key: string) {
        return this.compile();
    }
}