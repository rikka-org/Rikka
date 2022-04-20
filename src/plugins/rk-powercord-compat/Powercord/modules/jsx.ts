const JsxCompiler = require('powercord/compilers/jsx');

interface nodeModule {
  extname: string;
  absPath: string;
  absPathResolvedCorrectly: boolean;
  callingFile: string;
  local: boolean;
  moduleId: string;
  native: boolean;
  thirdParty: boolean;
}

interface compilerModule extends NodeJS.Module {
    _compile(code: string, filename: string): void;
}

export = () => {
  /** intercept((moduleId: any, module: nodeModule) => {
    if (module.extname === '.jsx' && module.local && module.absPathResolvedCorrectly) {
      console.log("Intercepting JSX file: " + module);
      console.log(module);

      // Change the extension to .js
      module.absPath = module.absPath.replace(/\.jsx$/, '.js');

      return require(module.absPath);
    }
  }) 
  */

  require.extensions['.jsx'] = (module, filename) => {
    // Bad code
    const compiler = new JsxCompiler(filename);
    const compiled = compiler.compile();
    (module as compilerModule)._compile(compiled, filename);
  };
};
