import { storeLocation } from "@rikka/API/Constants";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export class Store {
    private data: { [key: string]: any } = {};

    private hooks: { [key: string]: any } = {};

    private storeName: string;

    constructor(storeName: string) {
        this.storeName = storeName;

        if (!existsSync(storeLocation))
            mkdirSync(storeLocation);
    }

    get(key: string) {
        return this.data[key];
    }

    set(key: string, value: any) {
        this.data[key] = value;
    }

    delete(key: string) {
        delete this.data[key];
    }

    createDataHook(name: string, handler: (key: string, value: any) => void) {
        const prox = new Proxy(this, {
            set: (target, key, value) => {
                if (typeof key === "symbol") key = key.toString();
                target.set(key, value);
                handler(key, value);
                return true;
            }
        });

        this.hooks[name] = handler;

        return prox;
    }

    removeDataHook(name: string) {
        delete this.hooks[name];
    } 

    getDataHooks() {
        return this.hooks;
    }

    getDataHook(name: string) {
        return this.hooks[name];
    }

    saveToFile(file: string) {
        const storeDirectory = join(storeLocation, this.storeName);

        if (!existsSync(storeDirectory))
            mkdirSync(storeDirectory, { recursive: true });
        
        const storeFile = join(storeDirectory, file);

        writeFileSync(storeFile, JSON.stringify(this.data, null, 4), "utf8");
    }

    loadFromFile(file: string) {
        const storeFile = join(storeLocation, this.storeName, file);
        if(!existsSync(storeFile)) return;

        this.data = JSON.parse(readFileSync(storeFile, "utf8"));
    }

    writeRaw(file: string, data: string) {
        const storeDirectory = join(storeLocation, this.storeName);

        if (!existsSync(storeDirectory))
            mkdirSync(storeDirectory, { recursive: true });
        
        const storeFile = join(storeDirectory, file);

        writeFileSync(storeFile, data, "utf8");
    }

    readRaw(file: string) {
        const storeFile = join(storeLocation, this.storeName, file);
        if(!existsSync(storeFile)) return;

        return readFileSync(storeFile, "utf8");
    }
}