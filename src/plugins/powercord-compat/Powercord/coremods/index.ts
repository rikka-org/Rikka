import registry from "./registry";
const unloadFuncs: any[] = [];

export async function load() {
    for (const mod of registry) {
        try {
            const unload = await mod();
            if (typeof unload === 'function') {
                unloadFuncs.push(unload);
            }
        } catch (e) {
            console.error(e); // Stronger logging + warning
        }
    }
}

export function unload() {
    return Promise.all(unloadFuncs.map(f => f()));
}
