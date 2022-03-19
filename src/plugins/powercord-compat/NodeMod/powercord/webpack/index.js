/**
 * Copyright (c) 2018-2020 aetheryx & Bowser65
 * All Rights Reserved. Licensed under the Porkord License
 * https://powercord.dev/porkord-license
 */

 if (!global.NEW_BACKEND) {
  module.exports = require('./old.webpack.js');
  return;
}

const { join } = require('path');
const { readFile } = require('fs').promises;
const { webFrame, contextBridge } = require('electron');
const { deserialize, freePointer, setCommandHandler } = require('./serialize.js');
const moduleFilters = require('./modules.json');
const MODULE_ID = Symbol.for('powercord.webpack.moduleId');

/**
 * @typedef WebpackInstance
 * @property {object} cache
 * @property {function} require
 */

/**
 * @typedef ContextMenuModule
 * @property {function} openContextMenu
 * @property {function} closeContextMenu
 */

// --
// Webpack interface
// --
let commandHandler = null;
const DISPLAY_NAME_FN = /=>\s*(?:\w+\??.(\w+)(?:\?\.|\s*&&\s*\w+\.\1\.)displayName|_optionalChain\(\[\w+, 'optionalAccess', _2 => _2\.(\w+), 'optionalAccess', _3 => _3\.displayName]\))\s*={2,3}\s*['"](.*)['"]/;

function processResult (res, all) {
  if (!res) {
    return res;
  }

  if (res instanceof Promise) {
    return res.then((r) => processResult(r, all));
  }

  if (all) {
    return res.map((r) => processResult(r));
  }

  const mdl = deserialize(res[1]);
  if (mdl && (typeof mdl === 'function' || typeof mdl === 'object')) {
    // eslint-disable-next-line prefer-destructuring
    mdl[MODULE_ID] = res[0];
  }

  return mdl;
}

/**
 * Grabs a module from the Webpack store
 * @param {function|string[]} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
 * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {boolean} forever If Powercord should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The found module. A promise will always be returned, unless retry is false.
 */
function getModule (filter, retry = true, forever = false) {
  if (typeof filter === 'function') {
    const match = filter.toString().match(DISPLAY_NAME_FN);
    if (match) {
      const res = commandHandler('getModuleByDisplayNameRaw', match[1] || match[2], match[3], retry, forever);
      return processResult(res);
    }

    const _filter = filter;
    filter = (e) => !!_filter(deserialize(e));
  }

  const res = commandHandler('getModule', filter, retry, forever);
  return processResult(res);
}

/**
 * Grabs all found modules from the webpack store
 * @param {function|string[]} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
 * @returns {object[]} The found modules.
 */
function getAllModules (filter) {
  if (typeof filter === 'function') {
    const _filter = filter;
    filter = (e) => !!_filter(deserialize(e));
  }

  const res = commandHandler('getAllModules', filter);
  return processResult(res, true);
}

/**
 * Grabs a React component by its display name
 * @param {string} displayName Component's display name.
 * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {boolean} forever If Powercord should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
 */
function getModuleByDisplayName (displayName, retry = true, forever = false) {
  const res = commandHandler('getModuleByDisplayName', displayName.toLowerCase(), retry, forever);
  return processResult(res);
}

function getModuleById (id) {
  const res = commandHandler('getModuleById', id);
  return processResult(res);
}

let elementPointer = 0;
function lookupReactReference (element) {
  if (!element) {
    return;
  }

  if (!('__reactFiber$' in element)) {
    Object.defineProperty(element, '__reactFiber$', {
      get: () => {
        element.dataset.powercordPointer = elementPointer;
        const res = commandHandler('lookupReactReference', elementPointer++);
        element.removeAttribute('data-powercord-pointer');
        return deserialize(res);
      }
    });
  }
}

/**
 * @property {ContextMenuModule} contextMenu
 * @property {WebpackInstance} instance
 */
const webpack = {
  getModule,
  getAllModules,
  getModuleByDisplayName,
  require: getModuleById,

  // Internal tape stuff
  __lookupReactReference: lookupReactReference,

  /**
   * Initializes the injection into Webpack
   * @returns {Promise<void>}
   */
  async init () {
    delete webpack.init;

    // Init proxy script
    const serializeScript = await readFile(join(__dirname, 'serialize.js'), 'utf8');
    const proxyScript = await readFile(join(__dirname, 'proxy.js'), 'utf8');
    await webFrame.executeJavaScript(`(function () { ${serializeScript} ${proxyScript} return init() }())`);

    // Load modules pre-fetched
    for (const mdl in moduleFilters) {
      // noinspection JSUnfilteredForInLoop
      this[mdl] = await getModule(moduleFilters[mdl]);
    }

    this.i18n = getAllModules([ 'Messages', 'getLanguages' ]).find((m) => m.Messages.ACCOUNT);

    // Expose window stuff
    this.proxiedWindow = await commandHandler('getWindowProps');
    this.proxiedWindow.DiscordSentry = deserialize(this.proxiedWindow.DiscordSentry);
    this.proxiedWindow.__SENTRY__ = deserialize(this.proxiedWindow.__SENTRY__);
    this.proxiedWindow._ = deserialize(this.proxiedWindow._);
  }
};

contextBridge.exposeInMainWorld('__$$WebpackProxyIPC', {
  freePointer: (ptr) => freePointer(ptr),
  registerCommandHandler: (h) => {
    if (commandHandler) {
      throw new Error('no');
    }

    commandHandler = h;
    setCommandHandler(h);
  }
});

console.inspect = function (obj) {
  if ('__$$pointer' in obj) {
    commandHandler('inspect', obj.__$$pointer);
    return;
  }

  console.log(obj);
};

const remoteUrls = new Set();
const cou = URL.createObjectURL;
const rou = URL.revokeObjectURL;
URL.createObjectURL = function (blob) {
  if ('__$$pointer' in blob) {
    const url = commandHandler('createUrlObject', blob.__$$pointer);
    remoteUrls.add(url);
    return url;
  }

  return cou.call(URL, blob);
};

URL.revokeObjectURL = function (url) {
  if (remoteUrls.has(url)) {
    remoteUrls.delete(url);
    webFrame.executeJavaScript(`URL.revokeObjectURL(${JSON.stringify(url)})`);
    return;
  }

  rou.call(URL, url);
};

module.exports = webpack;
