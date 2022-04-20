const { Plugin } = require("powercord/entities");
const { inject } = require("powercord/injector");
const { messages } = require("powercord/webpack");

module.exports = class testPlugin2 extends Plugin {
  startPlugin() {
    console.log("Hello from Powercord!");
    // NOTE: It's recommended that you instead make a patch and submit it instead of a hacky workaround like this!
    if (powercord.rikkapc_version) console.log("Rikkapc detected!");
    else console.log("Rikkapc not detected!");

    this.testCommandMount();
    this.testBotMsg();
    console.log("Test complete!");
  }

  testCommandMount() {
    powercord.api.commands.registerCommand({
      command: "testCommandMount",
      description: "Test command mount",
      usage: "{c}testCommandMount",
      executor: () => {
        console.log("Hello mate");
      },
    });
  }

  testBotMsg() {
    inject("botMsgTest", messages, "sendMessage", (message) => {
      const regex = new RegExp("sus", "gmi");
      if (regex.test(message[1].content)) {
        setTimeout(() =>
          this.sendEphemeralMessage(
            "sus sus sus among us real real he said sus real real"
          )
        );
      }
    });
  }

  getModule(name) {
    let module;
    webpackChunkdiscord_app.push([
      [Math.random()],
      {},
      (r) => {
        module =
          module ||
          Object.values(r.c).find(
            (m) => m?.exports?.default && m.exports.default[name]
          );
      },
    ]);
    return module;
  }

  sendEphemeralMessage(content) {
    this.getModule("sendMessage").exports.default.sendBotMessage(
      this.getModule("getLastSelectedChannelId").exports.default.getChannelId(),
      content
    );
  }
};
