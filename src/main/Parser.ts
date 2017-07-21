import * as xml2js from "xml2js";
import * as fs from "fs";
import { ProjectRoot } from "./types/ProjectRoot";
import { DataAdapter } from "./util/DataAdapter";
import { RawData } from "./core/RawData";
import { AdaptedData } from "./core/AdaptedData";
import { XmlObjectError } from "./err/XmlObjectError";

/**
 * A class that parses an XML file and constructs a {@link ProjectRoot} instance based on
 * it.
 *
 * The process should be as follows:
 * <ul>
 *    <li>{@link xml2js} parses the XML file, producing a normal JS object containing text content, attributes, and other similar JS objects</li>
 *    <li>All of these JS objects have the same interface - RawData</li>
 *    <li>The root RawData instance is transformed into an AdaptedData isntance, and its children are transformed and so on</li>
 *    <li>A {@link ProjectRoot} object is instantiated with the root AdaptedData object</li>
 *    <li>In its internal 'initialize' method, the {@link ProjectRoot} object recursively initializes objects of other classes implementing XmlObject</li>
 * </ul>
 *
 * @export
 * @class Parser
 */
export class Parser {
   private parsed: ProjectRoot;
   /**
    * Creates an instance of Parser and parses the XML file located at {@link xmlPath}.
    *
    * @param {string} xmlPath
    * @memberof Parser
    */
   constructor(private xmlPath: string) {
      this.parseIfNotParsed();
   }

   private parseIfNotParsed(): void {
      if (this.parsed) return;
      if (!fs.existsSync(this.xmlPath)) {
         throw new Error("The file at path '" + this.xmlPath + "' does not exist.");
      }

      if (!fs.statSync(this.xmlPath).isFile) {
         throw new Error("'" + this.xmlPath + "' is not a file.");
      }

      let contents: string = fs.readFileSync(this.xmlPath).toString();
      xml2js.parseString(contents, { "explicitChildren": true, "normalize": true, "trim": true }, (err: any, result: any): void => {
         if (err instanceof Error) {
            throw new Error("The XML file (" + this.xmlPath + ":1:1) is invalid!\n" + err.message);
         }

         console.log("Preview:");
         console.log(JSON.stringify(result));

         const ROOT: RawData = result["ProjectRoot"];
         const ADAPTED_ROOT: AdaptedData = DataAdapter.adapt(ROOT);

         this.parsed = new ProjectRoot(ADAPTED_ROOT);
      });
   }
}