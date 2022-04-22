local Plugin = {}
Plugin.__index = Plugin

function Plugin.new()
    local self = {}
    setmetatable(self, Plugin)

    return self
end

function Plugin.inject()
    print("Injecting Plugin")
end

return Plugin