import manager from "./manager";
import { spawn } from "child_process";
import { demoonBin } from "../constants";
import { luaPluginInfo } from "../typings/luaPluginInfo";

export default class luaPluginManager extends manager {
    private processes = new Map<string, luaPluginInfo>();

    async loadPlugin(path: string) {
        const proc = await spawn(demoonBin, [path], { stdio: 'inherit' });

        const pluginName = path.split('/').pop()!.split('.')[0] ?? "name_not_found"

        const pluginInfo = {
            name: pluginName,
            path,
            process: proc,
        }

        this.processes.set(pluginName, pluginInfo);
    }

    async enablePlugin() {

    }

    async unloadPlugin(name: string) {
        const plugin = this.processes.get(name);

        if (!plugin) return;

        plugin.process.kill();
        this.processes.delete(name);
    }
}