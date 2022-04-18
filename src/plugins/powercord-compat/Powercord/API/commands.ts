import PluginsManager from "../../../../Rikka/managers/Plugins";
import Logger from "../../Common/Logger";
import API from "../../NodeMod/powercord/entities/API";

export = class CommandsAPI extends API {
    commands = new Map<string, any>();

    get prefix() {
        return powercord.settings.get('prefix', '.');
    }

    get find() {
        const arr = Object.values(this.commands);
        return arr.find.bind(arr);
    }

    get filter() {
        const arr = Object.values(this.commands);
        return arr.filter.bind(arr);
    }

    get map() {
        const arr = Object.values(this.commands);
        return arr.map.bind(arr);
    }

    get sort() {
        const arr = Object.values(this.commands);
        return arr.sort.bind(arr);
    }

    /**
     * Registers a command
     * @param {PowercordChatCommand} command Command to register
     */
    registerCommand(command: { command: string | number; }) {
        // @todo: remove this once there's a proper implemention (if any) for fetching the command origin.
        const stackTrace = (new Error()).stack;
        //@ts-ignore
        const [, origin] = stackTrace?.match(new RegExp(`${global._.escapeRegExp(PluginsManager.getPluginDirectory())}.([-\\w]+)`));

        if (typeof command === "string") return;

        if (this.commands.get(command.command.toString())) throw new Error(`Command ${command.command} is already registered!`);

        this.commands.set(command.command.toString(), {
            ...command,
            origin
        });
        Logger.trace(`Registered command ${command.command}`);
    }

    /**
     * Unregisters a command
     * @param {String} command Command name to unregister
     */
    unregisterCommand(command: string) {
        if (this.commands.get(command)) {
            this.commands.delete(command);
        }
    }
}
