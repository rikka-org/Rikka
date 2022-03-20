/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powercord.dev/porkord-license
 */

/* global FinalizationRegistry, WeakRef, __$$WebpackProxyIPC */

const EXPOSE_DEBUGGING_HELPER = false;
const PTR_MARKER = Symbol.for('powercord.serialize.pointer-marker');
const FUNCTION_ID = Symbol.for('powercord.serialize.function-id');
const MODULE_ID = Symbol.for('powercord.webpack.module-id');
const isMainWorld = typeof require === 'undefined';
let _commandHandler = () => void 0;

// --
// Memory management
// MAIN WORLD SIDE
// --
let ptr = 0;
const memorySpace = new Map();
const pointerMap = new WeakMap();
const mainWorldPointers = new WeakMap();

const pointerCache = new Map();
const functionCache = new Map();

function allocatePointer (obj) {
  if (!pointerMap.has(obj)) {
    memorySpace.set(ptr, obj);
    pointerMap.set(obj, ptr++);
  }

  return pointerMap.get(obj);
}

function freePointer (ptr) {
  pointerMap.delete(memorySpace.get(ptr));
  memorySpace.delete(ptr);
  pointerCache.delete(ptr);
}

function readPointer (ptr) {
  return memorySpace.get(ptr);
}


// --
// Memory management
// RENDERER WORLD SIDE
// --
const usedPointers = {};
const localPointerProperties = {};
const registry = new FinalizationRegistry((ptr) => {
  usedPointers[ptr]--;
  if (usedPointers[ptr] === 0) {
    delete usedPointers[ptr];
    pointerCache.delete(ptr);
    if (ptr in localPointerProperties) {
      delete localPointerProperties[ptr];
    }

    if (isMainWorld) {
      __$$WebpackProxyIPC.freePointer(ptr);
    } else {
      _commandHandler('releasePointer', ptr);
    }
  }
});

function usePointer (obj, ptr) {
  usedPointers[ptr] = (usedPointers[ptr] || 0) + 1;
  // if (usedPointers[ptr] > 1 && typeof ptr !== 'number') console.log('?????????');
  registry.register(obj, ptr);
}

function cachePointer (ptr, val) {
  pointerCache.set(ptr, new WeakRef(val));
}

function getCachedPointer (ptr) {
  return pointerCache.get(ptr)?.deref();
}

function cacheFunction (ptr, val) {
  functionCache.set(ptr, new WeakRef(val));
}

function getCachedFunction (ptr) {
  return functionCache.get(ptr)?.deref();
}


// --
// Real job
// --
function isCloneable (obj) {
  if (obj === null || obj === void 0) {
    return true;
  }

  // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
  const type = typeof obj;
  if (type === 'object') {
    return obj instanceof Date ||
      obj instanceof RegExp ||
      obj instanceof Blob ||
      obj instanceof File ||
      obj instanceof FileList ||
      obj instanceof ArrayBuffer ||
      obj instanceof ImageBitmap ||
      obj instanceof ImageData;
  }

  return type === 'boolean' ||
    type === 'string' ||
    type === 'number' ||
    type === 'bigint';
}

let fnRefId = 0;
let classRefId = 0;
const classMap = new WeakMap();
let htmlSerialId = isMainWorld ? 0 : 1;

function _serializeObjectData (obj, seen) {
  const res = {};
  let target = obj;
  while (target && target !== Object.prototype) {
    for (const key of Reflect.ownKeys(target)) {
      if (key in res || (typeof key === 'string' && key.startsWith('__$$'))) {
        continue;
      }

      const desc = Reflect.getOwnPropertyDescriptor(target, key);
      if ('value' in desc) {
        // eslint-disable-next-line no-use-before-define
        res[key] = serialize(target[key], seen, false);
      } else if ('get' in desc) {
        const fakeDesc = {
          configurable: desc.configurable,
          enumerable: desc.enumerable,
          // eslint-disable-next-line no-use-before-define
          get: () => serialize(target[key])
        };

        res[key] = {
          $$type: 'desc',
          desc: fakeDesc
        };
      }
    }

    target = Reflect.getPrototypeOf(target);
  }

  return res;
}

function serialize (obj, seen = new WeakMap()) {
  if (isCloneable(obj)) {
    return obj;
  }

  if (typeof obj === 'symbol') {
    return {
      $$type: '$symbol',
      value: Symbol.keyFor(obj)
    };
  }

  if (obj instanceof Promise) {
    return obj.then((v) => serialize(v));
  }

  if (obj === window) {
    return { $$type: '$window' };
  }

  if (obj === document) {
    return { $$type: '$document' };
  }

  if (obj instanceof Element) {
    obj.dataset.powercordSerializeId = htmlSerialId;
    const ptr = htmlSerialId;
    htmlSerialId += 2;
    return {
      $$type: '$html',
      ptr
    };
  }

  if (mainWorldPointers.has(obj)) {
    return {
      $$type: '$pointerRender',
      ptr: mainWorldPointers.get(obj)
    };
  }

  if (isMainWorld && !obj.__$$pure) {
    const ptr = allocatePointer(obj);
    if (Array.isArray(obj)) {
      return {
        $$type: '$array',
        data: obj.map((v) => serialize(v, seen)),
        ptr
      };
    }

    const type = typeof obj === 'function'
      ? obj.prototype && Object.keys(obj.prototype).length ? 'class' : 'function'
      : 'object';

    return {
      $$type: '$pointer',
      ptr,
      type
    };
  }

  if ('__$$pointer' in obj) {
    if (obj.__$$pointerType === 'class' && !obj.prototype.constructor.__$$props) {
      const serializedProto = {};
      for (const mth of Reflect.ownKeys(obj.prototype)) {
        if ([ 'constructor', '__$$remotePrototype' ].includes(mth)) {
          continue;
        }

        serializedProto[mth] = serialize(obj.prototype[mth]);
      }

      function construct (args, ptr) {
        obj.prototype.__$$ptr = ptr;
        obj.prototype.__$$marker = PTR_MARKER;
        // eslint-disable-next-line new-cap, no-use-before-define
        const instance = new obj(...deserialize(args));
        usePointer(instance, ptr);
        return serialize(instance);
      }

      const ref = classMap.get(obj) ?? classRefId++;
      classMap.set(obj, ref);
      return {
        $$type: '$pointer',
        type: 'class',
        ptr: obj.__$$pointer,
        props: serializedProto,
        construct,
        ref
      };
    }

    return {
      $$type: '$pointer',
      ptr: obj.__$$pointer
    };
  }

  if (seen.has(obj)) {
    return seen.get(obj);
  }

  if (Array.isArray(obj)) {
    const res = [];
    seen.set(obj, res);
    for (const v of obj) {
      res.push(serialize(v, seen));
    }

    return res;
  }

  if (typeof obj === 'function') {
    const wrapper = (...args) => {
      // eslint-disable-next-line no-use-before-define
      const preparedArgs = deserialize(args);
      const res = obj.call(...preparedArgs);
      return serialize(res);
    };

    if (!(FUNCTION_ID in obj)) {
      // todo: free memory on the other side when garbage collected
      obj[FUNCTION_ID] = fnRefId++;
    }

    const res = {
      $$type: '$function',
      fn: wrapper,
      ref: obj[FUNCTION_ID],
      str: obj.toString()
    };

    seen.set(obj, res);
    return res;
  }

  if (obj instanceof Set) {
    const res = new Set();
    seen.set(obj, res);
    for (const item of obj) {
      res.add(serialize(item, seen));
    }

    return res;
  }

  if (obj instanceof Map) {
    const res = new Map();
    seen.set(obj, res);
    for (const k in obj) {
      if (k in obj) {
        res.set(k, serialize(res[k], seen));
      }
    }

    return res;
  }

  const res = {};
  seen.set(obj, res);
  const objProto = Reflect.getPrototypeOf(obj);
  if (!objProto || objProto === Reflect.getPrototypeOf({})) {
    for (const k in obj) {
      if (k in obj) {
        res[k] = serialize(obj[k], seen);
      }
    }

    return res;
  }

  if (!isMainWorld) {
    res.__$$pointerRender = allocatePointer(obj);
    res.getData = () => _serializeObjectData(obj);
  } else {
    Object.assign(res, _serializeObjectData(obj));
  }

  return res;
}

const pointerProxyHandler = {
  get: (target, key) => {
    const props = target.__$$props || target;
    if (key === '__$$pointer') {
      return props.ptr;
    }

    if (key === '__$$pointerType') {
      return props.type;
    }

    if (key === 'prototype') {
      if (target.prototype) {
        // todo: make better & get rid of special case in injector?
        const remote = _commandHandler('getObjectProperty', props.ptr, 'prototype');
        // eslint-disable-next-line no-use-before-define
        target.prototype.__$$remotePrototype = deserialize(remote);
      }

      return target.prototype;
    }

    if (key === 'remotePrototype') {
      key = 'prototype';
    }

    if (typeof target === 'function' && [ 'bind', 'call', 'apply' ].includes(key)) {
      return target[key];
    }

    if (props.ptr in localPointerProperties && key in localPointerProperties[props.ptr]) {
      return localPointerProperties[props.ptr][key];
    }

    const res = _commandHandler('getObjectProperty', props.ptr, key);
    // eslint-disable-next-line no-use-before-define
    return deserialize(res);
  },
  set: (target, key, value) => {
    const props = target.__$$props || target;
    if (!localPointerProperties[props.ptr]) {
      localPointerProperties[props.ptr] = Object.create(null);
    }

    if (key === MODULE_ID || (value && typeof value === 'object' && !('__$$pointer' in value))) {
      // Cache local objects to avoid unnecessary IPC roundtrips.
      if (key === MODULE_ID) {
        localPointerProperties[props.ptr][key] = value;
      }
    }

    if (key === MODULE_ID) {
      return true;
    }

    _commandHandler('setObjectProperty', props.ptr, key, serialize(value));
    return true;
  },
  defineProperty: (target, key, descriptor) => {
    const props = target.__$$props || target;
    _commandHandler('defineObjectProperty', props.ptr, key, serialize(descriptor));
    return true;
  },
  deleteProperty: (target, key) => {
    const props = target.__$$props || target;
    _commandHandler('deleteObjectProperty', props.ptr, key);
    return true;
  },
  has: (target, key) => {
    if ([ '__$$pointer', '__$$pointerType' ].includes(key)) {
      return true;
    }

    const props = target.__$$props || target;
    return _commandHandler('hasObjectKey', props.ptr, key);
  },
  ownKeys: (target) => {
    const props = target.__$$props || target;
    const targetKeys = '$$type' in target ? [] : Reflect.ownKeys(target);
    const remoteKeys = _commandHandler('getObjectOwnKeys', props.ptr);
    for (const key of remoteKeys) {
      if (targetKeys.indexOf(key) === -1) {
        targetKeys.push(key);
      }
    }

    return targetKeys;
  },
  getOwnPropertyDescriptor: (target, key) => {
    const props = target.__$$props || target;
    const targetDesc = Object.getOwnPropertyDescriptor(target, key);
    if (targetDesc && !targetDesc.configurable) {
      return targetDesc;
    }

    if (!props.$$cachedDescriptors) {
      props.$$cachedDescriptors = Object.create(null);
    }

    if (key in props.$$cachedDescriptors) {
      return props.$$cachedDescriptors[key];
    }

    // eslint-disable-next-line no-use-before-define
    const desc = _commandHandler('getObjectPropertyDescriptor', props.ptr, key);
    if (!desc) {
      return void 0;
    }

    const res = {
      configurable: true,
      enumerable: desc.enumerable
    };

    if ('value' in desc) {
      res.writable = desc.writable;
      // eslint-disable-next-line no-use-before-define
      res.value = deserialize(desc.value);
    }

    if ('get' in desc) {
      // eslint-disable-next-line no-use-before-define
      res.get = deserialize(desc.get);
    }

    if ('set' in desc) {
      // eslint-disable-next-line no-use-before-define
      res.set = deserialize(desc.set);
    }

    props.$$cachedDescriptors[key] = res;
    return res;
  },
  getPrototypeOf: (target) => {
    const props = target.__$$props || target;
    if (props.__$$proto) {
      return props.__$$proto;
    }

    const res = _commandHandler('getObjectProperty', props.ptr, '__proto__');
    // eslint-disable-next-line no-use-before-define
    const dres = deserialize(res);
    props.__$$proto = dres;
    return dres;
  },
  apply: (target, thisArg, args) => {
    const props = target.__$$props || target;
    if (props.type === 'class') {
      // eslint-disable-next-line new-cap
      return new target(...args);
    }

    return target.call(thisArg, ...args);
  }
};

const classProxyHandler = {
  get: (target, key) => {
    if (key in target) {
      return target[key];
    }

    if (key === '__$$pointer') {
      return target.__$$remotePtr;
    }

    if (key === '__$$pointerType') {
      return 'object';
    }

    const res = _commandHandler('getObjectProperty', target.__$$remotePtr, key);
    // eslint-disable-next-line no-use-before-define
    return deserialize(res);
  },
  set: (target, key, value) => {
    if (key in target || key.startsWith('__$$')) {
      target[key] = value;
    }

    if (![ '__$$remotePtr', MODULE_ID ].includes(key)) {
      _commandHandler('setObjectProperty', target.__$$remotePtr, key, serialize(value));
    }

    return true;
  },
  deleteProperty: (target, key) => {
    _commandHandler('deleteObjectProperty', target.__$$remotePtr, key);
    return true;
  },
  has: (target, key) => {
    if ([ '__$$pointer', '__$$pointerType' ].includes(key)) {
      return true;
    }

    return _commandHandler('hasObjectKey', target.__$$remotePtr, key);
  },
  ownKeys: (target) => _commandHandler('getObjectOwnKeys', target.__$$remotePtr),
  getOwnPropertyDescriptor: (target, key) => {
    const desc = _commandHandler('getObjectPropertyDescriptor', target.__$$remotePtr, key);
    return {
      configurable: true,
      ...desc
    };
  }
};

const arrayProxyHandler = {
  get: (target, key) => {
    if ([ 'pop', 'shift', 'push', 'unshift' ].includes(key)) {
      return (...args) => {
        _commandHandler('performArrayOperation', key, target.__$$pointer, serialize(args));
        return target[key](...args);
      };
    }

    return target[key];
  },
  set: (target, key, value) => {
    _commandHandler('performArrayOperation', 'set', target.__$$pointer, [ key, serialize(value) ]);
    target[key] = value;
    return true;
  }
};

const mainWorldClassMap = {};
function deserialize (obj, seen = new WeakMap()) {
  if (isCloneable(obj)) {
    return obj;
  }

  if (obj.$$type === '$symbol') {
    return Symbol.for(obj.value);
  }

  if (obj instanceof Promise) {
    return obj.then((v) => deserialize(v));
  }

  if (obj.$$type === '$pointer') {
    if (isMainWorld) {
      const res = readPointer(obj.ptr);
      if (obj.type === 'class') {
        if (!mainWorldClassMap[obj.ref]) {
          class Klass extends res {
            constructor (...args) {
              super(...args);
              const ptr = allocatePointer(this);
              const res = obj.construct(serialize(args), ptr);
              Object.assign(this, deserialize(res));
            }
          }

          for (const mth in obj.props) {
            if (mth in obj.props) {
              Klass.prototype[mth] = deserialize(obj.props[mth]);
            }
          }

          mainWorldClassMap[obj.ref] = Klass;
        }

        return mainWorldClassMap[obj.ref];
      }

      return res;
    }

    const { ptr } = obj;
    const cached = getCachedPointer(ptr);
    if (cached) {
      return cached;
    }

    if (obj.type === 'function') {
      const props = obj;
      obj = function (...args) {
        const thisArg = serialize(this);
        const preparedArgs = serialize(args);
        const res = _commandHandler('invokeFunction', props.ptr, thisArg, preparedArgs);
        return deserialize(res);
      };

      obj.__$$props = props;
    }

    if (obj.type === 'class') {
      const props = obj;
      obj = class {
        constructor (...args) {
          if (this.__$$marker === PTR_MARKER) {
            // eslint-disable-next-line prefer-destructuring
            this.__$$remotePtr = this.__$$ptr;
            delete this.__$$marker;
            delete this.__$$ptr;
          } else {
            const preparedArgs = serialize(args);
            const res = _commandHandler('instantiateClass', props.ptr, preparedArgs);
            this.__$$remotePtr = res.ptr;
          }

          const proxy = new Proxy(this, classProxyHandler);
          let proto = Reflect.getPrototypeOf(this);
          while (proto && proto !== Object.prototype) {
            for (const key of Reflect.ownKeys(proto)) {
              if ([ 'constructor', '__$$remotePrototype', '__$$remotePtr' ].includes(key)) {
                continue;
              }

              proxy[key] = this[key];
            }

            proto = Reflect.getPrototypeOf(proto);
          }

          return proxy;
        }
      };

      const prototype = deserialize(_commandHandler('getObjectProperty', props.ptr, 'prototype'));
      for (const mth of Reflect.ownKeys(prototype)) {
        if ([ 'constructor', '__$$remotePrototype' ].includes(mth)) {
          continue;
        }

        if (!(mth in prototype)) {
          continue;
        }

        Object.defineProperty(obj.prototype, mth, {
          configurable: true,
          enumerable: true,
          get: () => {
            const val = prototype[mth];
            if (typeof val === 'function') {
              const fn = function (...args) {
                const preparedArgs = serialize(args);
                const res = _commandHandler('invokeFunction', val.__$$pointer, serialize(this), preparedArgs);
                return deserialize(res);
              };

              fn.toString = val.toString.bind(val);
              return fn;
            }

            return val;
          },
          set: (val) => {
            if ('set' in Object.getOwnPropertyDescriptor(prototype, mth)) {
              prototype[mth] = val;
            }
          }
        });
      }

      obj.__$$props = props;
      obj.__$$isRemote = true;
    }

    const proxy = new Proxy(obj, pointerProxyHandler);
    cachePointer(ptr, proxy);
    usePointer(proxy, ptr);
    return proxy;
  }

  if (obj.$$type === '$pointerRender') {
    return readPointer(obj.ptr);
  }

  if (obj.$$type === '$array') {
    const { ptr } = obj;
    const cached = getCachedPointer(ptr);
    if (cached) {
      return cached;
    }

    const res = obj.data.map((v) => deserialize(v, seen));
    res.__$$pointer = obj.ptr;

    const proxy = new Proxy(res, arrayProxyHandler);
    cachePointer(ptr, proxy);
    usePointer(proxy, ptr);
    return proxy;
  }

  if (obj.$$type === '$window') {
    return window;
  }

  if (obj.$$type === '$document') {
    return document;
  }

  if (obj.$$type === '$html') {
    const element = document.querySelector(`[data-powercord-serialize-id="${obj.ptr}"]`);
    element.removeAttribute('data-powercord-serialize-id');
    return element;
  }

  if (obj.$$type === '$function') {
    const cached = getCachedFunction(obj.ref);
    if (cached) {
      return cached;
    }

    const { fn, str } = obj;
    const wrapper = function (...args) {
      const thisArg = serialize(this);
      const preparedArgs = args.map((arg) => serialize(arg));
      const res = fn(thisArg, ...preparedArgs);
      return deserialize(res);
    };

    wrapper.toString = () => str;
    cacheFunction(obj.ref, wrapper);
    return wrapper;
  }

  if (typeof obj === 'function') {
    return function (...args) {
      const thisArg = serialize(this);
      const preparedArgs = args.map((arg) => serialize(arg));
      const res = obj(thisArg, ...preparedArgs);
      return deserialize(res);
    };
  }

  if (Array.isArray(obj)) {
    const res = [];
    seen.set(obj, res);
    for (const v of obj) {
      res.push(deserialize(v, seen));
    }

    Object.defineProperty(res, '__$$pure', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: true
    });

    return res;
  }

  if (obj instanceof Set) {
    const res = new Set();
    for (const item of obj) {
      res.add(deserialize(item, seen));
    }

    return res;
  }

  if (obj instanceof Map) {
    const res = new Map();
    for (const k in obj) {
      if (k in obj) {
        res.set(k, deserialize(res[k], seen));
      }
    }

    return res;
  }

  if (seen.has(obj)) {
    return seen.get(obj);
  }

  const res = {};
  let ptr = null;
  if (Reflect.has(obj, '__$$pointerRender')) {
    ptr = obj.__$$pointerRender;
    const cached = getCachedPointer(ptr);
    if (cached) {
      return cached;
    }

    obj = obj.getData();
    mainWorldPointers.set(res, ptr);
    usePointer(res, ptr);
  }

  seen.set(obj, res);
  for (const key of Reflect.ownKeys(obj)) {
    if (key === '__$$pointerRender') {
      continue;
    }

    const val = obj[key];
    if (val?.$$type === 'desc') {
      const fakeDesc = {
        configurable: val.desc.configurable,
        enumerable: val.desc.enumerable,
        get: () => deserialize(val.desc.get())
      };

      Object.defineProperty(res, key, fakeDesc);
    }

    res[key] = deserialize(val, seen);
  }

  Object.defineProperty(res, '__$$pure', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: true
  });

  if (ptr !== null) {
    cachePointer(ptr, res);
  }

  return res;
}


// --
// Exports if in renderer
// --
if (!isMainWorld) {
  module.exports = {
    serialize,
    deserialize,
    usePointer,
    freePointer,
    setCommandHandler: (h) => (_commandHandler = h)
  };

  if (EXPOSE_DEBUGGING_HELPER) {
    let passed = [];
    require('electron').contextBridge.exposeInMainWorld('0$$SerializeDebuggerHelper', {
      pass: (v) => passed.push(deserialize(v)),
      get: () => passed.map((v) => serialize(v)),
      eq: () => passed.every((v) => v === passed[0]),
      log: () => console.log(passed),
      clear: () => passed = []
    });

    window.__$$SerializeDebuggerHelper = Object.create(null);
    window.__$$SerializeDebuggerHelper.push = (...args) => passed.push(...args);
    window.__$$SerializeDebuggerHelper.get = () => [ ...passed ];
    window.__$$SerializeDebuggerHelper.log = () => console.log(passed);
    window.__$$SerializeDebuggerHelper.eq = () => passed.every((v) => v === passed[0]);
    window.__$$SerializeDebuggerHelper.clear = () => passed = [];
    Object.freeze(window.__$$SerializeDebuggerHelper);
  }
}

if (EXPOSE_DEBUGGING_HELPER) {
  if (isMainWorld) {
    window.__$$SerializeDebuggerHelper = Object.create(null);
    window.__$$SerializeDebuggerHelper.pass = (v) => window['0$$SerializeDebuggerHelper'].pass(serialize(v));
    window.__$$SerializeDebuggerHelper.get = () => window['0$$SerializeDebuggerHelper'].get().map((v) => deserialize(v));
    window.__$$SerializeDebuggerHelper.eq = () => window['0$$SerializeDebuggerHelper'].eq();
    window.__$$SerializeDebuggerHelper.log = () => window['0$$SerializeDebuggerHelper'].log();
    window.__$$SerializeDebuggerHelper.clear = () => window['0$$SerializeDebuggerHelper'].clear();
    window.__$$SerializeDebuggerHelper.leq = () => {
      const val = window.__$$SerializeDebuggerHelper.get();
      return val.every((v) => v === val[0]);
    };

    Object.freeze(window.__$$SerializeDebuggerHelper);
  }

  window.__$$SerializeMemoryArea = Object.create(null);
  window.__$$SerializeMemoryArea.memorySpace = memorySpace;
  window.__$$SerializeMemoryArea.usedPointers = usedPointers;
  window.__$$SerializeMemoryArea.localPointerProperties = localPointerProperties;
  window.__$$SerializeMemoryArea.pointerCache = pointerCache;
  window.__$$SerializeMemoryArea.functionWrappers = functionCache;
  Object.freeze(window.__$$SerializeMemoryArea);
}