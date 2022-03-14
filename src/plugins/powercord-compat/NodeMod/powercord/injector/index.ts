import { randomBytes } from "crypto";
import Logger from "../../../Common/Logger";

type injectable = {
    module: any,
    id: string,
    method: Function,
    pre: boolean
}

const injections = new Array<injectable>();

export function inject(injectId: string, mod: any, funcName: string, patch: any, pre: boolean = false) {
    if (!mod) {
        Logger.trace(`Failed to inject ${injectId} into ${funcName}. No module provided.`);
        return;
    }

    if (injections.find(i => i.id === injectId)) {
        Logger.trace(`Injection ${injectId} already exists`);
    }

    if (!mod.__powercordInjectionId || !mod.__powercordInjectionId[funcName]) {
        // 1st injection
        const id = randomBytes(16).toString('hex');
        mod.__powercordInjectionId = Object.assign((mod.__powercordInjectionId || {}), { [funcName]: id });
        // Honestly no idea what this is for, but some Powercord plugins cry if it's not there
        mod[`__powercordOriginal_${funcName}`] = mod[funcName];
        mod[funcName] = (_oldMethod => function (...args: any) {
            // @ts-ignore
            const finalArgs = _runPreInjections(id, args, this);
            if (finalArgs !== false && Array.isArray(finalArgs)) {
                // @ts-ignore
                const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;

                // @ts-ignore
                return _runInjections(id, finalArgs, returned, this);
            }
        })(mod[funcName]);
    }

    injections.push({
        module: mod.__powercordInjectionId[funcName],
        id: injectId,
        method: patch,
        pre
    })
}

export function uninject(injectId: string) {
    injections.filter(i => i.id !== injectId);
}

export function isInjected(injectId: string) {
    return injections.some(i => i.id === injectId);
}

export function _runPreInjections(id: string, originalArgs: any, _this: any) {
    const injectionsMap = injections.filter(i => i.module === id && i.pre);
    if (!injectionsMap.length) return originalArgs;
}

export function _runPreInjectionsRecursive(injections: injectable[], originalArgs: any, _this: any): any {
    const injection = injections.pop();
    if (!injection) return originalArgs;
    let args;

    try {
        args = injection.method.apply(_this, originalArgs);
    } catch (e) {
        Logger.trace(`Failed to run pre-injection ${injection.id}`);
        return _runPreInjectionsRecursive
    }

    if (args === false) return false;
    
    if (!Array.isArray(args)) {
        Logger.trace(`Something really screwed up in pre-injection ${injection.id}, passing original args`);
        args = originalArgs;
    }

    if (!injections.length) return _runPreInjectionsRecursive(injections, args, _this);
    return args;
}

export function _runInjections(id: string, originalReturn: any, _this: any) {
    let finalRet = originalReturn;
    const injectionsMap = injections.filter(i => i.module === id && !i.pre);
    injectionsMap.forEach(i => {
        try {
            finalRet = i.method.call(_this, finalRet);
        } catch (e) {
            Logger.trace(`Failed to run injection ${i.id}`);
        }
    });
    return finalRet;
}
