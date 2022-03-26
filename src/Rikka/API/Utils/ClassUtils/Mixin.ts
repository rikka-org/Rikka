// Constructor type but with generics
type GConstructor<T = {}> = new (...args: any[]) => T;


/** Mixin function that uses generics */
export function Mixin<TBase extends GConstructor, TClass extends GConstructor<TBase>>(Base: TBase, Class: TClass): TClass {
    // @ts-ignore
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
            // @ts-ignore
            Object.setPrototypeOf(this, Class.prototype);
            // @ts-ignore
            Class.call(this, ...args);
        }
    };
}
