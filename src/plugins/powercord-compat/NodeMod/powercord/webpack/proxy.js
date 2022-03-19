/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powercord.dev/porkord-license
 */

/* global serialize, deserialize */
/* global readPointer, freePointer */
/* global __$$WebpackProxyIPC */

const LOCAL = Symbol('powercord.webpack.local');
const KEY = Symbol('powercord.webpack.key');

// --
// Initialization & globals
// --
const webpackInstance = {};
const cache = {};
// eslint-disable-next-line no-unused-vars
async function init () {
  while (!window.webpackChunkdiscord_app || !window._) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Extract values from webpack
  webpackChunkdiscord_app.push([
    [ [ '_powercord' ] ],
    {},
    (r) => {
      webpackInstance.cache = r.c;
      webpackInstance.require = (m) => r(m);
    }
  ]);
}


// --
// Module fetching (+ window globals)
// --
function _getModules (filter, all) {
  let key;
  if (Array.isArray(filter)) {
    const keys = filter;
    filter = (m) => keys.every((k) => m.hasOwnProperty(k) || (m.__proto__ && m.__proto__.hasOwnProperty(k)));
    key = `props:${keys.join(',')}`;
  } else if (!filter[LOCAL]) {
    const _filter = filter;
    filter = (m) => _filter(serialize(m));
  } else {
    key = filter[KEY];
  }

  if (!all && cache[key]) {
    return cache[key];
  }

  const moduleInstances = Object.values(webpackInstance.cache).filter((m) => m.exports);
  if (all) {
    const exports = moduleInstances.filter((m) => filter(m.exports)).map((m) => [ m.i, m.exports ]);
    const expDefault = moduleInstances.filter((m) => m.exports.default && filter(m.exports.default)).map((m) => [ m.i, m.exports.default ]);
    return exports.concat(expDefault);
  }

  const exports = moduleInstances.find((m) => filter(m.exports));
  if (exports) {
    if (key) {
      cache[key] = [ exports.i, exports.exports ];
    }

    return [ exports.i, exports.exports ];
  }

  const expDefault = moduleInstances.find((m) => m.exports.default && filter(m.exports.default));
  if (expDefault) {
    if (key) {
      cache[key] = [ expDefault.i, expDefault.exports.default ];
    }

    return [ expDefault.i, expDefault.exports.default ];
  }

  return null;
}

function getModule (filter, retry, forever) {
  if (!retry) {
    return _getModules(filter);
  }

  return new Promise(async (res) => {
    let mdl;
    for (let i = 0; i < (forever ? 666 : 21); i++) {
      mdl = _getModules(filter);
      if (mdl) {
        return res(mdl);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    res(null);
  });
}

function getModuleByDisplayName (displayName, retry, forever) {
  const filter = (m) => m.displayName?.toLowerCase() === displayName;
  filter[KEY] = `name:${displayName}`;
  filter[LOCAL] = true;

  return getModule(filter, retry, forever);
}

function getModuleByDisplayNameRaw (prop, displayName, retry, forever) {
  const filter = (m) => m[prop]?.displayName === displayName;
  filter[KEY] = `name:${prop},${displayName}`;
  filter[LOCAL] = true;

  return getModule(filter, retry, forever);
}

function getModuleById (id) {
  const mdl = webpackInstance.require(id);
  if (mdl) {
    return [ id, mdl ];
  }
}

function getWindowProps () {
  return {
    platform: window.platform,
    GLOBAL_ENV: window.GLOBAL_ENV,
    DiscordSentry: serialize(window.DiscordSentry),
    __SENTRY__: serialize(window.__SENTRY__),
    _: serialize(window._)
  };
}

function lookupReactReference (ptr) {
  const element = document.querySelector(`[data-powercord-pointer="${ptr}"]`);
  const key = Object.keys(element).find((k) => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
  const fiber = element[key];
  return serialize(fiber);
}


// --
// Pointer operatons (lookup, ...)
// --
function getObjectProperty (ptr, key) {
  const obj = readPointer(ptr);
  return serialize(obj[key]);
}

function setObjectProperty (ptr, key, value) {
  const obj = readPointer(ptr);
  obj[key] = deserialize(value);
}

function defineObjectProperty (ptr, key, desc) {
  const obj = readPointer(ptr);
  Object.defineProperty(obj, key, deserialize(desc));
}

function deleteObjectProperty (ptr, key) {
  const obj = readPointer(ptr);
  delete obj[key];
}

function getObjectOwnKeys (ptr) {
  const obj = readPointer(ptr);
  return Reflect.ownKeys(obj);
}

function hasObjectKey (ptr, key) {
  const obj = readPointer(ptr);
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getObjectPropertyDescriptor (ptr, key) {
  const obj = readPointer(ptr);
  let desc;
  let target = obj;
  while (!desc && target) {
    desc = Object.getOwnPropertyDescriptor(target, key);
    target = Object.getPrototypeOf(target);
  }

  if (!desc) {
    return void 0;
  }

  const res = {
    configurable: desc.configurable,
    enumerable: desc.enumerable,
    writable: desc.writable
  };

  if ('value' in desc) {
    res.value = serialize(desc.value);
  }

  if ('get' in desc) {
    res.get = serialize(desc.get);
  }

  if ('set' in desc) {
    res.set = serialize(desc.set);
  }

  return res;
}

function invokeFunction (ptr, thisArg, args) {
  const fn = readPointer(ptr);
  const res = fn.call(deserialize(thisArg), ...deserialize(args));
  return serialize(res);
}

function instantiateClass (ptr, args) {
  const Klass = readPointer(ptr);
  const instance = new Klass(...deserialize(args));
  return serialize(instance);
}

function performArrayOperation (op, ptr, args) {
  const array = readPointer(ptr);
  if (op === 'set') {
    array[args[0]] = deserialize(args[1]);
    return;
  }

  array[op](...deserialize(args));
}


// --
// Entry point
// --
function _serializeModuleRes (res, all) {
  if (!res) {
    return res;
  }

  if (res instanceof Promise) {
    return res.then((r) => _serializeModuleRes(r, all));
  }

  if (all) {
    return res.map((m) => _serializeModuleRes(m));
  }

  return [ res[0], serialize(res[1]) ];
}

function commandHandler (cmd, ...args) {
  switch (cmd) {
    case 'getModule':
      return _serializeModuleRes(getModule(args[0], args[1], args[2]));
    case 'getModuleByDisplayName':
      return _serializeModuleRes(getModuleByDisplayName(args[0], args[1], args[2]));
    case 'getModuleByDisplayNameRaw':
      return _serializeModuleRes(getModuleByDisplayNameRaw(args[0], args[1], args[2], args[3]));
    case 'getModuleById':
      return _serializeModuleRes(getModuleById(args[0]));
    case 'getAllModules':
      return _serializeModuleRes(_getModules(args[0], true), true);
    case 'getWindowProps':
      return getWindowProps();

    case 'lookupReactReference':
      return lookupReactReference(args[0]);

    case 'getObjectProperty':
      return getObjectProperty(args[0], args[1]);
    case 'setObjectProperty':
      return setObjectProperty(args[0], args[1], args[2]);
    case 'defineObjectProperty':
      return defineObjectProperty(args[0], args[1], args[2]);
    case 'deleteObjectProperty':
      return deleteObjectProperty(args[0], args[1]);
    case 'hasObjectKey':
      return hasObjectKey(args[0], args[1]);
    case 'getObjectOwnKeys':
      return getObjectOwnKeys(args[0]);
    case 'getObjectPropertyDescriptor':
      return getObjectPropertyDescriptor(args[0], args[1]);

    case 'invokeFunction':
      return invokeFunction(args[0], args[1], args[2]);
    case 'instantiateClass':
      return instantiateClass(args[0], args[1]);
    case 'performArrayOperation':
      return performArrayOperation(args[0], args[1], args[2]);

    case 'releasePointer':
      return freePointer(args[0]);
    case 'inspect':
      return console.log(readPointer(args[0]));

    case 'createUrlObject':
      return URL.createObjectURL(readPointer(args[0]));
  }

  console.log(cmd, args);
}

__$$WebpackProxyIPC.registerCommandHandler(commandHandler);
// eslint-disable-next-line no-undef
_commandHandler = commandHandler;

const mkfn = (fn) => (...args) => {
  if (typeof args[0] === 'function') {
    args[0][LOCAL] = true;
  }

  return fn(...args)?.[1];
};

window.$PowercordWebpack = {
  getModule: mkfn(getModule),
  getAllModules: mkfn((a) => _getModules(a, true)),
  getModuleByDisplayName: mkfn((a, b, c) => getModuleByDisplayName(a.toLowerCase(), b, c)),
  require: mkfn(getModuleById)
};
