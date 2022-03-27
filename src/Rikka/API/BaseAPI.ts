import RikkaPlugin from "@rikka/Common/Plugin";

export default class BaseAPI {
    ready = false;

    _load() {
        this.ready = true;
    }

    _unload() {
        
    }

    /** TODO: Implement */
    pluginHasPermission(plugin: RikkaPlugin, permission: string) {
        return true;
    }
}
