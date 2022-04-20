export default class Logger {
    static trace(...args: any[]) {
        // Print who called this function
        const stack = new Error().stack;

        //@ts-ignore
        const caller = stack.split('\n')[2].split('at ')[1].split(' ')[0];
        console.log(`[${caller}]`, ...args);
    }
}
