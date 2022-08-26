require("fs")
  .readdirSync(__dirname)
  .filter((file: string) => file.endsWith(".json"))
  .forEach((filename: string) => {
    const moduleName = filename.split(".")[0];
    if (!moduleName) return;
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
