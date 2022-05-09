import getRepoInfo from "git-repo-info";
import Events from "events";

type updatableInfo = {
    gitRepo: string;
    branch: string;
    commit: string;
}

export default class Updatable extends Events {
  protected updatableInfo: updatableInfo = {
    gitRepo: "",
    branch: "",
    commit: "",
  };

  protected id: string = this.constructor.name;

  constructor() {
    super();

    const repoInfo = this.getGitRepo();
    this.updatableInfo.gitRepo = "";

    this.updatableInfo.branch = repoInfo.branch;
    this.updatableInfo.commit = repoInfo.sha;
  }

  /**
     * @todo: fetch remote repository
     *  */
  protected getGitRepo() {
    const repoInfo = getRepoInfo();
    return repoInfo;
  }

  /** @todo */
  async _checkForUpdates() { }

  /** @todo */
  async _update() { }
}
