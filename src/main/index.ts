import { Parser } from "./Parser";
import { ProjectRoot } from "./types/ProjectRoot";
export * from "./types";

/**
 * Parse the file at the specified path synchronously. An error is thrown on failure.
 *
 * @export
 * @param {string} path The path to the XML file
 * @returns {ProjectRoot} The project root corresponding to the XML file
 */
export function parseSync(path: string): ProjectRoot {
   return Parser.parseSync(path);
}