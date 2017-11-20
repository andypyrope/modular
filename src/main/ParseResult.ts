import { ProjectRoot } from "./types/ProjectRoot";

/**
 * The return type of {@link ParseUtil#parseXmlFileContentsSync}
 */
export interface ParseResult {
   /**
    * The error, if any, while parsing the XML file - defined only on failure
    */
   error?: Error;

   /**
    * The result - defined only on success
    */
   result?: ProjectRoot;
}