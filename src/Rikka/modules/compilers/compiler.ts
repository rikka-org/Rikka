import { Store } from "@rikka/API/storage";
import { createHash } from "crypto";
import Events from "events";
import { readFileSync } from "fs";
import { FileWatcher } from "typescript";

export default abstract class Compiler extends Events {
  protected get compilerInfo() {
    return "";
  }

  static readonly extensions: string[];

  protected file: string;

  watchEnabled: boolean = false;

  private watchers: { [key: string]: FileWatcher } = {};

  private cacheStore = new Store("rk-compiler");

  protected filename: string;

  protected fileHash: string;

  protected cacheName = this.constructor.name;

  constructor(file: string) {
    super();

    this.file = file;

    this.filename = file.replace(/\\/g, "/").split("/").pop() ?? "";
    this.fileHash = this.computeFileHash();
  }

  protected abstract compile(): any;

  doCompilation() {
    let res: string;

    const cached = this.readCached();
    if (cached) {
      res = cached;
    } else {
      res = this.compile();
      this.writeCached(res);
    }

    return res;
  }

  protected readCached() {
    return this.cacheStore.readRaw(this.fileHash, this.cacheName);
  }

  protected writeCached(content: string) {
    this.cacheStore.writeRaw(this.fileHash, content, this.cacheName);
  }

  private computeFileHash() {
    const fileBuffer = readFileSync(this.file);
    return createHash("sha1")
      .update(this.compilerInfo)
      .update(fileBuffer)
      .digest("hex");
  }
}
