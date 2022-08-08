/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-proto */
/* eslint-disable no-prototype-builtins */
import { Logger, sleep } from "../Utils";
import { wpModule } from "./typings/wp_module";
import moduleFilters from "./modules.json";
import { extraModules } from "./typings/extraModules";
import otherModules from "./extraModules.json";

type filter = (m: any) => boolean;

type filterType = RegExp | filter | boolean;

type instanceType = {
    c: { [key: string]: wpModule };
    displayName: string;
    default: any;
}

const _getModules = (filter: filterType, all: boolean = false) => {
  if (!(this as any).instance?.c) return;

  const instances = (Object.values((this as any).instance.c) as wpModule[]).filter(
    (module) => module.exports,
  );

  if (all) {
    const exports = instances
    // @ts-ignore your mom has a dick
      .filter((m) => filter(m.exports))
      .map((m) => m.exports);

    const exportDefault = instances
    // @ts-ignore your mom has a dick
      .filter((m) => m.exports.default && filter(m.exports.default))
      .map((m) => m.exports.default);

    return exports.concat(exportDefault);
  }

  // @ts-ignore your mom has a dick
  const exports = instances.find((m) => filter(m.exports));

  if (exports) return exports.exports;

  // @ts-ignore your mom has a dick
  const exportDefault = instances.find((m) => m.exports.default && filter(m.exports.default));

  if (exportDefault) return exportDefault.exports.default;
};

const _getModule = (filter: filter, retry: boolean = false, forever: boolean = false) => {
  if (Array.isArray(filter)) {
    const keys = filter;
    filter = (m) => keys.every(
      (key) => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)),
    );
  }

  if (!retry) return _getModules(filter);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    let module: any;
    for (let i = 0; i < (forever ? 666 : 21); i += 1) {
      module = _getModules(filter);
      // eslint-disable-next-line no-promise-executor-return
      if (module) return resolve(module);
      // eslint-disable-next-line no-await-in-loop
      await sleep(1);
    }
    resolve(module);
  });
};

export const init = async () => {
  if (!window.webpackChunkdiscord_app) window.webpackChunkdiscord_app = [];

  window.webpackChunkdiscord_app.push([
    [Symbol("rikka")],
    {},
    // eslint-disable-next-line no-return-assign
    (exports: any) => (this as any).instance = exports,
  ]);

  for (const mdl in moduleFilters) {
    // @ts-ignore
    this[mdl] = await _getModule(moduleFilters[mdl], true);
  }
};

export const getModuleByDisplayName = (name: string, retry: boolean = false, forever: boolean = false) => _getModule(
  (m) => m?.displayName
          && m?.displayName?.toLowerCase() === name.toLowerCase(),
  retry,
);

export const getModule = (...filter: any) => {
  let retry = false;
  let forever = false;

  if (typeof filter[filter.length - 1] === "boolean") {
    forever = filter.pop() as boolean;
    if (typeof filter[filter.length - 1] === "boolean") {
      retry = filter.pop() as boolean;
    } else {
      retry = forever;
      forever = false;
    }
  }

  if (typeof filter[0] === "function") {
    [filter] = filter as any;
  }

  return _getModule(filter as unknown as filter, retry, forever);
};

export const getModuleById = (id: string, retry: boolean = false, forever: boolean = false) => _getModule((m) => m?._dispatchToken === `ID_${id}`, retry, forever);

export const getModules = (filter: any) => {
  if (Array.isArray(filter)) {
    const keys = filter;
    filter = (m: any) => keys.every(
      (key) => m.hasOwnProperty(key)
                || (m.__proto__ && m.__proto__.hasOwnProperty(key)),
    );
  }

  return _getModules(filter, true);
};

export const findComponent = (keyword: string, precise: boolean = false) => {
  let byDisplayName;
  let byDefault;
  let byType;

  const results = {};

  if (precise) {
    byDisplayName = (this as any).getModuleByDisplayName(keyword);
    byDefault = (this as any).getModules((m: any) => m.default && m.default.displayName === keyword);
    byType = (this as any).getModules((m: any) => m.type && m.type.displayName === keyword);
  } else {
    keyword = keyword.toLowerCase();
    byDisplayName = (this as any).getModules(
      (m: any) => m.default
            && m.default.displayName
            && m.default.displayName.toLowerCase().indexOf(keyword) > -1,
    );
    byDefault = (this as any).getModules(
      (m: any) => m.default
            && m.default.displayName
            && m.default.displayName.toLowerCase().indefOf(keyword) > -1,
    );
    byType = (this as any).getModules(
      (m: any) => m.type
            && m.type.displayName
            && m.type.displayName.toLowerCase().indexOf(keyword) > -1,
    );
  }

  if (byDisplayName && byDisplayName.length) {
    Object.assign(results, {
      displayName: {
        matches: byDisplayName,
      },
    });

    if (byDefault && byDefault.length) {
      Object.assign(results, {
        default: {
          matches: byDefault,
        },
      });
    }

    if (byType && byType.length) {
      Object.assign(results, {
        type: {
          matches: byType,
        },
      });
    }

    if (!results || !Object.keys(results).length) {
      return Logger.warn(`Unable to find component ${precise ? "matching" : "with"} "${keyword}"`);
    }
  }
};

export const getAllModules = () => (this as any).getModules((m: any) => m);

export default this;
