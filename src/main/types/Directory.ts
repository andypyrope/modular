import { Module } from "./Module";
import { XmlObject } from "../XmlObject";

/**
 * Represents a real-life directory in the file system, which can contain subdirectories
 * and modules. It, of course, has a name as well.
 */
export interface Directory extends XmlObject {
   /**
    * The path of the directory
    */
   readonly dirPath: string;
   /**
    * The name of the directory (the past portion of {@link dirPath}).
    */
   readonly dirName: string;
   /**
    * An array of the modules directly under this directory
    */
   readonly directModules: ReadonlyArray<Module>;
   /**
    * An array of the directories directly under this directory
    */
   readonly directDirectories: ReadonlyArray<Directory>;
   /**
    * A map containing all the modules in this directory, both direct and indirect
    */
   readonly modules: { readonly [id: string]: Module };
}