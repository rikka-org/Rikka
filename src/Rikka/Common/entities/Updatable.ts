type updatableInfo = {
    gitRepo: string;
    branch: string;
    commit: string;
}

export default class Updatable {
    protected updatableInfo: updatableInfo = {
        gitRepo: "",
        branch: "",
        commit: ""
    };

    protected id: string = this.constructor.name;

    constructor() {}

    /** @todo */
    getGitRepo() {}

    /** @todo */
    async _checkForUpdates() {}

    /** @todo */
    async _update() {}
}