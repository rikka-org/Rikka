import BaseAPI from "../BaseAPI";
import Command from "./Command";

export default class CommandsAPI extends BaseAPI {
    private activeCommands = new Map<string, Command>();

    private commandPrefix = 'r!'

    addCommand(command: Command) {
        this.activeCommands.set(command.name, command);
    }
}