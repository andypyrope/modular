import { Directory } from "./Directory";
import { ModuleType } from "../ModuleType";
import { Module } from "./Module";
import { XmlObject } from "../XmlObject";

/**
 * The project root. It contains all the default configurations for all modules as well
 * as the modules themselves. It should be the output of the Parser.
 */
export interface ProjectRoot extends XmlObject {
   /**
    * The root directory of the project
    */
   readonly rootDirectory: Directory;
   /**
    * A map of all the modules in the project
    */
   readonly modules: { readonly [id: string]: Module };

   /**
    * Gets a list of all the modules in this project.
    *
    * @param type The desired module type
    * @returns The modules of that type
    */
   allModulesOfType(type: ModuleType): Module[];

   /**
    * @param module The module or the ID of the module to look for
    * @return The IDs of all modules that depend on the specified one
    */
   getDependentModuleIds(module: Module | string): string[];

   /**
    * Gets the dependencies of a module as well as the module itself in the form of
    * strings (their IDs).
    *
    * @param sourceModule The module or module ID to start the recursive search for
    *                     dependencies from
    */
   getBuildOrder(sourceModule: Module | string): (string | string[])[];
}