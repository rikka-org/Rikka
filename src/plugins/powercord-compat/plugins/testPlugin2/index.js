const { Plugin } = require('powercord/entities');

module.exports = class testPlugin2 extends Plugin {
    startPlugin() {
        console.log("Hello from Powercord!");
    }
}