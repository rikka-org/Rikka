import { camelCase, kebabCase, snakeCase } from "lodash";

/** Converts a string to kebab-case
 * @param str The string to convert
 * @returns The string in kebab-case
 */
export function toKebabCase(str: string): string {
    return kebabCase(str);
}

/** Converts a string to CamelCase
 * @param str The string to convert
 * @returns The string in CamelCase
 */
export function toCamelCase(str: string): string {
    return camelCase(str);
}

/** Converts a string to snake_case
 * @param str The string to convert
 * @returns The string in snake_case
 */
export function toSnakeCase(str: string): string {
    return snakeCase(str);
}

export * from "./owoify";
