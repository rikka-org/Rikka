import Events from "events";
import { existsSync } from "fs";
import { join } from "path";
import { promisify } from "util";
import cp from "child_process";
import Logger from "../../../Common/Logger";
const exec = promisify(cp.exec);

export = class Updatable extends Events {
  basePath: string;

  entityID?: string;

  entityPath: string;

  updateIdentifier: string;

  private __shortCircuit: boolean = false;

  constructor(basePath: string, entityID?: string, updateIdentifier?: string) {
    super();

    this.basePath = basePath;
    if (!this.entityID) {
      // It might be pre-defined by plugin manager
      this.entityID = entityID;
    }

    this.entityPath = join(this.basePath, this.entityID ?? "fixme-eid-undefined");

    if (!updateIdentifier) {
      updateIdentifier = `${this.basePath.split(/[\\/]/).pop()}_${this.entityID}`;
    }
    this.updateIdentifier = updateIdentifier;
  }

  async _checkForUpdates(): Promise<boolean> {
    Logger.trace("Stub %d", this.entityID);
    return false;
  }

  isUpdatable() {
    return existsSync(join(this.basePath, this.entityID ?? "FIXME", '.git')) && !this.__shortCircuit;
  }

  async getGitRepo() {
    const abort = new AbortController();
    const timeout = setTimeout(() => {
      abort.abort();
      throw new Error('Timed out.');
    }, 10e3);

    try {
      return await exec('git remote get-url origin', {
        cwd: this.entityPath,
        signal: abort.signal
      }).then((r) => {
        clearTimeout(timeout);
        return r.stdout.toString().match(/github\.com[:/]([\w-_]+\/[\w-_]+)/) ?? 'FIXME_GITREPO_STUB'[1];
      });
    } catch (e) {
      clearTimeout(timeout);
      console.warn('Failed to fetch git origin url; ignoring.');
      return null;
    }
  }

  protected log = (...args: any[]) => Logger.trace(...args);

  protected warn = (...args: any[]) => Logger.trace(`[WARN] ${this.entityID}`, ...args);

  protected error = (...args: any[]) => Logger.trace(`[ERROR] ${this.entityID}`, ...args);
}