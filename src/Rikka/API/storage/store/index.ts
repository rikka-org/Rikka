/* eslint-disable no-dupe-class-members */
import { storeLocation } from "@rikka/API/Constants";
import {
  existsSync, mkdirSync, readFileSync, rmdirSync, writeFileSync,
} from "fs";
import { join } from "path";
import { copy } from "fs-extra";

export type storeOptions = {
  autoSave?: boolean,
  workingDirectory?: string
}

/**
 * An easy way to work with JSON.
 */
export class Store<T = any> {
  private data: { [key: string]: T } = {};

  private hooks: { [key: string]: any } = {};

  private storeName: string;

  readonly workingDirectory: string;

  private autoSave: boolean;

  constructor(storeName: string, options?: storeOptions) {
    this.storeName = storeName;
    this.workingDirectory = options?.workingDirectory ?? join(storeLocation, this.storeName);
    this.autoSave = !!options?.autoSave;

    if (!existsSync(this.workingDirectory)) {
      mkdirSync(this.workingDirectory, { recursive: true });
    }
  }

  get<F>(key: string, fallback?: F): F extends undefined ? undefined : F

  get<F>(key: string, fallback?: F) {
    return this.data[key] || fallback;
  }

  set(key: string, value: any) {
    if (this.autoSave) this.save();

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
      },
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
    if (!existsSync(this.workingDirectory)) {
      mkdirSync(this.workingDirectory, { recursive: true });
    }

    const storeFile = join(this.workingDirectory, file);

    writeFileSync(storeFile, JSON.stringify(this.data, null, 4), "utf8");
  }

  save() {
    this.saveToFile(`${this.storeName}.json`);
  }

  loadFromFile(file: string) {
    const storeFile = join(storeLocation, this.storeName, file);
    if (!existsSync(storeFile)) return;

    this.data = JSON.parse(readFileSync(storeFile, "utf8"));
  }

  load() {
    this.loadFromFile(`${this.storeName}.json`);
  }

  writeRaw(file: string, data: string, subdir?: string) {
    const storeDir = join(this.workingDirectory, subdir ?? "");
    const storeFile = join(storeDir, file);

    if (!existsSync(storeDir)) { mkdirSync(storeDir, { recursive: true }); }

    writeFileSync(storeFile, data, "utf8");
  }

  readRaw(file: string, subdir?: string) {
    const storeFile = join(storeLocation, this.storeName, subdir ?? "", file);
    if (!existsSync(storeFile)) return;

    return readFileSync(storeFile, "utf8");
  }

  deleteRaw(file: string) {
    const storeFile = join(storeLocation, this.storeName, file);
    if (!existsSync(storeFile)) return;

    writeFileSync(storeFile, JSON.stringify(this.data, null, 4), "utf8");
  }

  copyDirectory(from: string, to: string) {
    const directory = join(this.workingDirectory, to);

    return copy(from, directory);
  }

  deleteDirectory(subdir: string) {
    rmdirSync(join(this.workingDirectory, subdir), { recursive: true });
  }
}
