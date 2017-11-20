import { XmlObject } from "../XmlObject";

/**
 * An XML object describing a dependency to a module. It only contains data
 * about the module that is being depended on because it is assumed that the Dependency
 * instances are only inside the module that depends on the specified module.
 */
export interface Dependency extends XmlObject {
   /**
    * The ID of this dependency. It should equal the ID of a module
    */
   readonly id: string;
}