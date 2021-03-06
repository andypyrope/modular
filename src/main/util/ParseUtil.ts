import * as fs from "fs";
import * as xml2js from "xml2js";
import { ProjectRoot } from "../types/ProjectRoot";
import { XmlObjectBuilder } from "./XmlObjectBuilder";
import { DataAdapter } from "../util/DataAdapter";
import { RawData } from "../core/RawData";
import { AdaptedData } from "../core/AdaptedData";
import { ParseResult } from "../ParseResult";
import { ProjectRootImpl } from "../types/impl/ProjectRootImpl";

/**
 * A utility meant to be used when parsing a raw XML file.
 *
 * @export
 * @class ParseUtil
 */
export class ParseUtil {
   /**
    * Read a file synchronously and throw an error if it does not exist or is not a file.
    *
    * @static
    * @param {string} path The path to the file
    * @returns {string} The contents of the file
    * @memberof ParseUtil
    */
   static readFileSync(path: string): string {
      if (!fs.existsSync(path)) {
         throw new Error("The file at path '" + path + "' does not exist.");
      }

      if (!fs.statSync(path).isFile) {
         throw new Error("'" + path + "' is not a file.");
      }

      return fs.readFileSync(path).toString();
   }

   /**
    * Convert raw XML contents to a {@link ProjectRoot} instance.
    * Guaranteed not to throw an error and to return it instead.
    *
    * @static
    * @param {string} contents The XML contents
    * @param {{ [optionKey: string]: any }} parseOptions The options to use when parsing
    * the XML.
    * @returns {{ error: Error, result: ProjectRoot }} An object containing either an
    * error or the {@link ProjectRoot} instance.
    * @memberof ParseUtil
    */
   static parseXmlFileContentsSync(contents: string,
      parseOptions: { [optionKey: string]: any }): ParseResult {

      let returnValue: ParseResult = {};

      // NOTE alalev: This is done under the assumption that #parseString is NOT async
      xml2js.parseString(contents, parseOptions, (err: Error, res: any): void => {
         if (err) {
            returnValue.error = err;
            return;
         }

         try {
            const xmlRoot: RawData = res["ProjectRoot"];
            if (!xmlRoot) {
               throw new Error("The root element is not of type ProjectRoot");
            }
            const adaptedRoot: AdaptedData = DataAdapter.adapt(xmlRoot);

            returnValue.result = XmlObjectBuilder.instantiate<ProjectRoot, void>(
               adaptedRoot, ProjectRootImpl, undefined);
         } catch (e) {
            returnValue.error = e;
         }
      });

      return returnValue;
   }
}