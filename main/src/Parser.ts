import * as xml2js from "xml2js";
import * as fs from "fs";
import { ProjectRoot } from "./types/ProjectRoot";
import { Validator } from "validator.ts/Validator";
import { XmlObjectBuildingError } from "./err/XmlObjectBuildingError";

export class Parser {
   private parsed: ProjectRoot;
   constructor(private xmlPath: string) { this.parseIfNotParsed(); }

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
         // console.log("done");
         if (err instanceof Error) {
            throw new Error("The XML file (" + this.xmlPath + ":1:1) is invalid!\n" + err.message);
         }
         console.log(JSON.stringify(result));
         let root: ProjectRoot;
         try {
            root = new ProjectRoot(result["ProjectRoot"]);
         } catch (err) {
            console.log(err instanceof XmlObjectBuildingError);
            if (err instanceof XmlObjectBuildingError) {
               console.error("Error while parsing XML file (" + this.xmlPath +
                  ":1:1)\n" + err.stack);
            } else {
               throw err;
            }
         }
         if (root) {
            new Validator().validateOrThrow(root);
            root.examineUnused(true);
         }
      });
   }
}