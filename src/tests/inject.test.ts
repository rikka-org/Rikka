import { Prefix } from "@rikka/API/Injector";

test("uses prefix code into a function", () => {
    const fn = (a: number, b: number) => a + b;
    Prefix(fn, () => 3, false);
    expect(fn(1, 2)).toBe(3);
});
