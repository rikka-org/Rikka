type docFixCallback = {
    getDoc: (element: any, getI: number, setI: number) => void, 
    setDoc: (element: any, prop: string | number, value: any, getI: number, setI: number) => void,
};

export const docFixCallbacks: docFixCallback[] = [];

export let getI: number = 0;
export let setI: number = 0;

export function registerCallback(callback: docFixCallback) {
    docFixCallbacks.push(callback);
}
