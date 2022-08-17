type author = {
    name: string;
    uid: string;
}

type permissions = [string];

type PluginManifest = {
    name: string;
    description: string;
    author: author;
    license: string;
    version: string;
    /**
     * Source code of the plugin
     */
    source_url: string;
    /**
     * Permissions required to use the plugin
     * (not currently implemented, but future-proofing is nice)
     */
    permissions: permissions;
    preload?: boolean;
    /**
     * @deprecated
     */
    sandboxed?: boolean;
}
