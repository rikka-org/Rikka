import { ipcRenderer } from "electron";
import { IPC_Consts } from "../Constants";

export default function createHeadersHook(hookName: string, handler: (...args: any[]) => any) {
  const code = handler.toString();
  ipcRenderer.invoke(IPC_Consts.ADD_HEADER_HOOK, hookName, code);
}
