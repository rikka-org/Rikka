import BaseAPI from "../BaseAPI";
import Command from "../CommandsAPI/Command";

class CommandsAPIV2 extends BaseAPI {
    private activeCommands = new Map<string, Command>();

    private commandPrefix = 'r!'

    addCommand(command: Command) {
        this.activeCommands.set(command.name, command);
    }
}

export = new CommandsAPIV2();
