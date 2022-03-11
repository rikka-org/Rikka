const { Plugin } = require('powercord/entities');

module.exports = class testPlugin2 extends Plugin {
    startPlugin() {
        console.log("Hello from Powercord!");
        // NOTE: It's recommended that you instead make a patch and submit it instead of a hacky workaround like this!
        if (powercord.rikkapc_version)
            console.log("Rikkapc detected!");
        else
            console.log("Rikkapc not detected!");
    }
}