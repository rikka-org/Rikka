type author = {
    name: string;
    uid: string;
}

type PluginManifest = {
    name: string;
    description: string;
    author: author;

    license: string;
    version: string;
}
