rikkaPlugin = require "../../Rikka/Common/entities/Plugin.js"

module.exports.default = class rkCoffeeTest extends rikkaPlugin.default
    inject: ->
        console.log "hi from coffeescript";