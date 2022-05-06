import { getCaller } from "../Utils";
import { Logger } from "../Utils/logger";

export const patches: rikkapatch[] = [];
export const errorLimit = 5;

export type rkUnpatchFunction = () => void;

export type rikkapatch = {
    id: any;
    caller: any;
    moduleToPatch: any;
    functionName: any;
    originalFunction: any;
    unpatch: rkUnpatchFunction;
    childs: any;
    count: number;
    index: number;
};

export type moddedModule = {
    [x: string]: { [x: string]: any; };
};

export function runPatches(patches: any[], type: string, returnValue: undefined, _this: { [x: number]: (...args: any[]) => any; }, args: any[]) {
    for (const patch of patches.filter(p => p.type === type)) {
        try {
            const tempReturn = patch.callback.bind(_this)(args, returnValue, _this);

            if (typeof tempReturn !== 'undefined') returnValue = tempReturn;
        } catch (err) {
            Logger.error(`Error while running patch ${patch.name}:\n${err}`);
            patch.errorsOccurred++;
        }
    }

    return returnValue;
}

export function makeOverride(patch: rikkapatch) {
    return {
        [patch.originalFunction.name](...args: any[]) {
            let returnValue;
            if (!patch.childs.length) return patch.originalFunction.apply(this, args);

            try {
                let tempReturn = runPatches(patch.childs, 'before', returnValue, this, args);

                if (Array.isArray(tempReturn)) args = tempReturn;

                tempReturn = void 0;
                returnValue = patch.originalFunction.apply(this, args);

                tempReturn = runPatches(patch.childs, 'after', returnValue, this, args);

                if (typeof tempReturn !== 'undefined') returnValue = tempReturn;
            } catch (err) {
                Logger.error(`Error in ${patch.originalFunction.name} patch:\n${err}`);
            }

            return returnValue;
        }
    }[patch.originalFunction.name];
}

export function createPatch(id: any, moduleToPatch: moddedModule, functionName: string | number) {
    const patchData = {
        id,
        caller: "unimplemented",
        moduleToPatch,
        functionName,
        originalFunction: moduleToPatch[functionName],
        unpatch: () => {
            // @ts-ignore
            patchData.moduleToPatch[moduleToPatch.functionName] = patchData.originalFunction;
            patchData.childs = [];
            patches.splice(patchData.index, 1);
        },
        childs: [],
        get count() { return this.childs.length; },
        // @ts-ignore
        get index() { return patches.indexOf(this); }
    };

    // @ts-ignore
    moduleToPatch[functionName] = makeOverride(patchData);
    Object.assign(moduleToPatch[functionName], patchData.originalFunction);
    // @ts-ignore
    moduleToPatch[functionName].toString = () => patchData.originalFunction.toString();
    // @ts-ignore
    moduleToPatch[functionName]['__rk-originalFunction'] = patchData.originalFunction;

    patches.push(patchData);

    return patchData;
}

/** Patch a webpack module with your custom code
 * @returns A function that unpatches the patch
 */
export function patch(...args: any[]) {
    if (typeof args[0] !== 'string') {
        const stack = new Error().stack;
        const caller = getCaller(stack ?? "");

        args.unshift(caller);
    };
    let [id, moduleToPatch, func, patchFunction, type = 'after', { failSave = true } = {}] = args;

    if (typeof type === 'boolean') {
        if (type) type = 'before';
        else type = 'after';
    }
    try {
        if (!moduleToPatch) {
            throw new Error(`Patch ID "${id}" tried to patch a module, but it was undefined!`);
        }
        if (!moduleToPatch[func]) {
            throw new Error(`Patch ID "${id}" tried to patch a function, but it was undefined!`);
        }
        if (typeof moduleToPatch[func] !== 'function') {
            throw new Error(`Patch ID "${id}" tried to patch a function, but found instead of a function!`);
        }

        const patchModule = patches.find(e => e.moduleToPatch === moduleToPatch && e.functionName === func) || createPatch(id, moduleToPatch, func);

        const child = {
            callback: patchFunction,
            type,
            id,
            caller: "unimplemented",
            moduleToPatch,
            functionName: func,
            unpatch: () => {
                patchModule.childs.splice(patchModule.childs.indexOf(child), 1);
            },
            _errorsOccurred: 0,
            get errorsOccurred() { return this._errorsOccurred; },
            set errorsOccurred(count) {
                if (count >= errorLimit && failSave) {
                    Logger.warn(`Patch ID "${id}" has failed ${count} times and has been removed.`);
                }
                this._errorsOccurred = count;
            }
        };

        patchModule.childs.push(child);
        return child.unpatch;
    } catch (err) {
        Logger.error(`Error while patching ${id}: ${err}`);
        return;
    }
}

const Patcher = { patch, patches }
export default Patcher;
