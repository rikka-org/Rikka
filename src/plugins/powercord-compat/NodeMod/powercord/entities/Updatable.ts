const Events = require('events');
import { join } from "path";
import Logger from "../../../Common/Logger";

export = class Updatable extends Events {
    basePath: string;
    entityID?: string;
    entityPath: string;
    updateIdentifier: string;

    constructor(basePath: string, entityID?: string, updateIdentifier?: string) {
        super();

        this.basePath = basePath;
        if (!this.entityID) {
            // It might be pre-defined by plugin manager
            this.entityID = entityID;
        }
        console.log(`EID: ${this.entityID}`);

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


}