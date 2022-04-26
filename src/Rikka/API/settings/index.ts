type setting = {
    name: string;
    description: string;
    type: string;
    callback: (value: any) => void;
};

type settingsCategory = {
    name: string;
    description: string;
    settings: Map<string, setting>;
};

const categories: { [ key: string ]: any } = {};

export function registerSetting(name: string, description: string, type: string, callback: (value: any) => void, initialSettings?: Map<string, setting>) {
    const settings = {
        name,
        description,
        settings: initialSettings || new Map(),
    };
    
    categories[name] = settings;

    return settings;
}
