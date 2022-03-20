const JsxCompiler = require('powercord/compilers/jsx');

interface compilerModule extends NodeJS.Module {
    _compile(code: string, filename: string): void;
}

export = () => {
  require.extensions['.jsx'] = (module, filename) => {
    const compiler = new JsxCompiler(filename);
    const compiled = compiler.compile();
    (module as compilerModule)._compile(compiled, filename);
  };
};
