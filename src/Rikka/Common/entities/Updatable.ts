import getRepoInfo from "git-repo-info";
import Events from "events";
import { Logger } from "@rikka/API/Utils";

type updatableInfo = {
  gitRepo: string;
  branch: string;
  commit: string;
}

/**
 * Generic updatable class, provides git info and manages updates
 * @remarks This class is not meant to be used directly, but rather extended by other classes.
*/
export default class Updatable extends Events {
  protected updatableInfo: updatableInfo = {
    gitRepo: "",
    branch: "",
    commit: "",
  };

  id: string = this.constructor.name;

  path?: string;

  constructor() {
    super();

    const repoInfo = this.getGitRepo();
    this.updatableInfo.gitRepo = repoInfo.worktreeGitDir;

    this.updatableInfo.branch = repoInfo.branch;
    this.updatableInfo.commit = repoInfo.sha;
  }

  // todo: fetch repo
  protected getGitRepo() {
    const repoInfo = getRepoInfo();
    return repoInfo;
  }

  // todo
  _checkForUpdates() {
    throw new Error("Not implemented");
  }

  // todo
  _update() {
    throw new Error("Not implemented");
  }

  protected log(message: string) {
    Logger.log(`[${this.id}]: ${message}`);
  }

  protected warn(message: string) {
    Logger.warn(`[${this.id}]: ${message}`);
  }

  protected error(message: string) {
    Logger.error(`[${this.id}]: ${message}`);
  }
}
