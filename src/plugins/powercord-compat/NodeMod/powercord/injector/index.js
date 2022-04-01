window.__$$injectorRuns = [];
window.__$$injectorRecord = false;

const injector = {
  injections: [],

  /**
   * Injects into a function
   * @param {String} injectionId ID of the injection, used for uninjecting
   * @param {object} mod Module we should inject into
   * @param {String} funcName Name of the function we're aiming at
   * @param {function} patch Function to inject
   * @param {Boolean} pre Whether the injection should run before original code or not
   */
  inject: (injectionId, mod, funcName, patch, pre = false) => {
    if (!mod) {
      return injector._error(`Tried to patch undefined (Injection ID "${injectionId}")`);
    }

    // todo: maybe get rid of this thanks to more deserialize magic?
    if (mod.__$$remotePrototype) {
      mod = mod.__$$remotePrototype;
    }

    if (injector.injections.find(i => i.id === injectionId)) {
      return injector._error(`Injection ID "${injectionId}" is already used!`);
    }

    if (!mod.__powercordInjectionId || !mod.__powercordInjectionId[funcName]) {
      // 1st injection
      const id = Math.random().toString(16).slice(2);
      mod.__powercordInjectionId = Object.assign((mod.__powercordInjectionId || {}), { [funcName]: id });
      mod[`__powercordOriginal_${funcName}`] = mod[funcName]; // To allow easier debugging
      mod[funcName] = (_oldMethod => function (...args) {
        const start = process.hrtime.bigint();
        const finalArgs = injector._runPreInjections(id, args, this);
        if (finalArgs !== false && Array.isArray(finalArgs)) {
          const call1 = process.hrtime.bigint();
          const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
          const call2 = process.hrtime.bigint();

          // [Cynthia] I think (?) some of the crashes are due to functions injected in the runtime (such as onClick)
          // which may throw an error and cause the thing to fail catastrophically. One fix would be to build a deep
          // proxy of `returned`, and in the `set` handler wrap potentially sensitive stuff in a try/catch block.

          const res = injector._runInjections(id, finalArgs, returned, this);
          const end = process.hrtime.bigint();
          if (window.__$$injectorRecord) {
            window.__$$injectorRuns.push({
              ids: injector.injections.filter(i => i.module === id).map((i) => i.id),
              duration: Number(end - start) - Number(call2 - call1)
            });
          }

          return res;
        }
      })(mod[funcName]);

      injector.injections[id] = [];
    }

    injector.injections.push({
      module: mod.__powercordInjectionId[funcName],
      id: injectionId,
      method: patch,
      pre
    });
  },

  /**
   * Removes an injection
   * @param {String} injectionId The injection specified during injection
   */
  uninject: (injectionId) => {
    injector.injections = injector.injections.filter(i => i.id !== injectionId);
  },

  /**
   * Check if a function is injected
   * @param {String} injectionId The injection to check
   */
  isInjected: (injectionId) => injector.injections.some(i => i.id === injectionId),

  _runPreInjections: (modId, originArgs, _this) => {
    const injections = injector.injections.filter(i => i.module === modId && i.pre);
    if (injections.length === 0) {
      return originArgs;
    }
    return injector._runPreInjectionsRecursive(injections, originArgs, _this);
  },

  _runPreInjectionsRecursive: (injections, originalArgs, _this) => {
    const injection = injections.pop();
    let args;
    try {
      args = injection.method.call(_this, originalArgs);
    } catch (e) {
      injector._error(`Failed to run pre-injection "${injection.id}"`, e);
      return injector._runPreInjectionsRecursive(injections, originalArgs, _this);
    }

    if (args === false) {
      return false;
    }

    if (!Array.isArray(args)) {
      injector._error(`Pre-injection ${injection.id} returned something invalid. Injection will be ignored.`);
      args = originalArgs;
    }

    if (injections.length > 0) {
      return injector._runPreInjectionsRecursive(injections, args, _this);
    }
    return args;
  },

  _runInjections: (modId, originArgs, originReturn, _this) => {
    let finalReturn = originReturn;
    const injections = injector.injections.filter(i => i.module === modId && !i.pre);
    injections.forEach(i => {
      try {
        finalReturn = i.method.call(_this, originArgs, finalReturn);
      } catch (e) {
        injector._error(`Failed to run injection "${i.id}"`, e);
      }
    });
    return finalReturn;
  },

  _error: (...args) => {
    console.error('%c[Powercord:Injector]', 'color: #7289da', ...args);
  }
};

/** @module powercord/injector */
module.exports = injector;
