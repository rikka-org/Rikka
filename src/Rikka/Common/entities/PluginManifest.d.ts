type PluginManifest = {
    name: string;
    description: string;
    author: string;

    license: string;
    version: string;

    dependencies: string[] | { [key: string]: string };
}