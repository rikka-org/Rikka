export type powercordManifest = {
    name: string;
    version: string;
    description?: string;
    theme: string,
    splashTheme?: string,
    author: string,
    consent: string,
    license: string,
}

export type vizalityManifest = powercordManifest & {
    icon?: string;
}

export type rikkaManifest = vizalityManifest & {
    /**
     * Source code of the theme
     */
    source_url?: string;
}
