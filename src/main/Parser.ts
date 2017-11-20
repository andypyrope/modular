import { ProjectRoot } from "./types/ProjectRoot";
import { ParseUtil } from "./util/ParseUtil";
import { ParseResult } from "./ParseResult";

/**
 * A class that parses an XML file and constructs a {@link ProjectRoot} instance from it.
 *
 * @export
 * @class Parser
 */
export class Parser {
   private static readonly PARSE_OPTIONS: { [optionKey: string]: any } = {
      "explicitCharkey": true,
      "explicitChildren": true,
      "normalize": true,
      "trim": true
   };

   /**
    * Parse the file at the specified path synchronously. An error is thrown on failure.
    *
    * @static
    * @param {string} path The path to the XML file
    * @returns {ProjectRoot} The project root corresponding to the XML file
    * @memberof Parser
    */
   static parseSync(path: string): ProjectRoot {
      const CONTENTS: string = ParseUtil.readFileSync(path);

      const result: ParseResult =
         ParseUtil.parseXmlFileContentsSync(CONTENTS, this.PARSE_OPTIONS);

      if (result.error) {
         throw result.error;
      } else if (result.result) {
         return result.result;
      }
      throw new Error("No result and no error");
   }
}