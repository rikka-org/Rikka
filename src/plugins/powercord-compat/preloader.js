require("./polyfills");

if (global.NEW_BACKEND) {
  Object.defineProperty(window, '_', { get: () => require('powercord/webpack').proxiedWindow._ });

  const getFunctions = [
    ["querySelector", false],
    ["querySelectorAll", true],
    ["getElementById", false],
    ["getElementsByClassName", true],
    ["getElementsByName", true],
    ["getElementsByTagName", true],
    ["getElementsByTagNameNS", true],
  ];

  for (const [getMethod, isCollection] of getFunctions) {
    const realGetter = document[getMethod].bind(document);
    if (isCollection) {
      document[getMethod] = (...args) => {
        const webpack = require("powercord/webpack");
        const nodes = Array.from(realGetter(...args));
        nodes.forEach((node) => webpack.__lookupReactReference(node));
        return nodes;
      };
    } else {
      document[getMethod] = (...args) => {
        const webpack = require("powercord/webpack");
        const node = realGetter(...args);
        webpack.__lookupReactReference(node);
        return node;
      };
    }
  }
} else if (process.contextIsolated) {
  const genericProxyWrapper = {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, value) {
      if (typeof value === "function") {
        target[prop] = (...args) => value(...args);
      } else {
        target[prop] = value;
      }
      return true;
    },
  };

  class BetterResizeObserver extends ResizeObserver {
    constructor(fn) {
      super((...args) => fn(...args));
    }
  }

  class BetterMutationObserver extends MutationObserver {
    constructor(fn) {
      super((...args) => fn(...args));
    }
  }

  class BetterXHR extends XMLHttpRequest {
    constructor() {
      // eslint-disable-next-line constructor-super
      return new Proxy(super(), genericProxyWrapper);
    }

    get upload() {
      return new Proxy(super.upload, genericProxyWrapper);
    }
  }

  window.ResizeObserver = BetterResizeObserver;
  window.MutationObserver = BetterMutationObserver;
  window.XMLHttpRequest = BetterXHR;

  function wrapFunctions() {
    /* eslint-disable accessor-pairs */
    class BetterWS extends WebSocket {
      set onclose(fn) {
        super.onclose = (...args) => fn(...args);
      }

      set onerror(fn) {
        super.onerror = (...args) => fn(...args);
      }

      set onmessage(fn) {
        super.onmessage = (...args) => fn(...args);
      }

      set onopen(fn) {
        super.onopen = (...args) => fn(...args);
      }
    }
    /* eslint-enable accessor-pairs */

    window.WebSocket = BetterWS;

    function rebindEventTarget(target) {
      const realAddEventListener = target.addEventListener;
      const realRemoveEventListener = target.removeEventListener;

      target.addEventListener = function (type, fn, ...args) {
        this.__listenerStore = this.__listenerStore || new Map();
        if (!this.__listenerStore.has(type)) {
          this.__listenerStore.set(type, new WeakMap());
        }

        function listener(...args) {
          fn.apply(this, args);
        }

        this.__listenerStore.get(type).set(fn, listener);
        realAddEventListener.call(this, type, listener, ...args);
      };

      target.removeEventListener = function (type, fn, ...args) {
        this.__listenerStore = this.__listenerStore || new Map();
        if (!this.__listenerStore.has(type)) {
          this.__listenerStore.set(type, new WeakMap());
        }

        const map = this.__listenerStore.get(type);
        const listener = map.get(fn);
        realRemoveEventListener.call(this, type, listener, ...args);
        map.delete(fn);
      };
    }

    rebindEventTarget(window);
    rebindEventTarget(document);
    rebindEventTarget(Element.prototype);
    rebindEventTarget(XMLHttpRequestEventTarget.prototype);
    rebindEventTarget(WebSocket.prototype);
  }

  wrapFunctions();
  webFrame.executeJavaScript(
    `(${wrapFunctions.toString().replace("wrapFunctions", "")}())`
  );

  let pointer = 0;
  function fetchRealElement(element) {
    element.dataset.powercordReactInstancePointer = ++pointer;
    const realNode = webFrame.top.context.document.querySelector(
      `[data-powercord-react-instance-pointer="${pointer}"]`
    );
    realNode.removeAttribute("data-powercord-react-instance-pointer");
    return realNode;
  }

  function fetchInternal() {
    const realNode = fetchRealElement(this);
    const key = Object.keys(realNode).find(
      (key) =>
        key.startsWith("__reactInternalInstance") ||
        key.startsWith("__reactFiber")
    );
    this.__reactInternalInstance$ = realNode[key];
    this.__reactFiber$ = realNode[key];

    return realNode[key];
  }

  function fetchInternalRoot() {
    const realNode = fetchRealElement(this);
    this._reactRootContainer = realNode._reactRootContainer;
    return realNode._reactRootContainer;
  }

  function wrapElement(node) {
    if (node) {
      if (node.id === "app-mount" && !node._reactRootContainer) {
        node._reactRootContainer = null;
        Object.defineProperty(node, "_reactRootContainer", {
          get: fetchInternalRoot,
          configurable: true,
        });
      } else if (node.id !== "app-mount" && !node.__reactInternalInstance$) {
        node.__reactInternalInstance$ = null;
        node.__reactFiber$ = null;
        Object.defineProperty(node, "__reactInternalInstance$", {
          get: fetchInternal,
          configurable: true,
        });
        Object.defineProperty(node, "__reactFiber$", {
          get: fetchInternal,
          configurable: true,
        });
      }
    }
  }

  const getFunctions = [
    ["querySelector", false],
    ["querySelectorAll", true],
    ["getElementById", false],
    ["getElementsByClassName", true],
    ["getElementsByName", true],
    ["getElementsByTagName", true],
    ["getElementsByTagNameNS", true],
  ];

  for (const [getMethod, isCollection] of getFunctions) {
    const realGetter = document[getMethod].bind(document);
    if (isCollection) {
      document[getMethod] = (...args) => {
        const nodes = Array.from(realGetter(...args));
        nodes.forEach((node) => wrapElement(node));
        return nodes;
      };
    } else {
      document[getMethod] = (...args) => {
        const node = realGetter(...args);
        wrapElement(node);
        return node;
      };
    }
  }
}
