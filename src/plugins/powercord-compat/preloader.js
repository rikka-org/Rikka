const getFunctions = [
    [ 'querySelector', false ],
    [ 'querySelectorAll', true ],
    [ 'getElementById', false ],
    [ 'getElementsByClassName', true ],
    [ 'getElementsByName', true ],
    [ 'getElementsByTagName', true ],
    [ 'getElementsByTagNameNS', true ]
  ];

for (const [ getMethod, isCollection ] of getFunctions) {
  const realGetter = document[getMethod].bind(document);
  if (isCollection) {
    document[getMethod] = (...args) => {
      const webpack = require('powercord/webpack');
      const nodes = Array.from(realGetter(...args));
      nodes.forEach((node) => webpack.__lookupReactReference(node));
      return nodes;
    };
  } else {
    document[getMethod] = (...args) => {
      const webpack = require('powercord/webpack');
      const node = realGetter(...args);
      webpack.__lookupReactReference(node);
      return node;
    };
  }
}
