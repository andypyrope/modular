import { ModuleType } from "../ModuleType";
import { Dependency } from "./Dependency";
import { XmlObject } from "../XmlObject";

/**
 * A module
 */
export interface Module extends XmlObject {
   /**
    * The ID of this module
    */
   readonly id: string;
   /**
    * The dependencies to other modules that this one has
    */
   readonly dependencies: ReadonlyArray<Dependency>;
   /**
    * The directory of this module. It includes a subdirectory that has the same name
    * as the ID of the module
    */
   readonly directory: string;
   /**
    * The type of this module
    */
   readonly type: ModuleType;

   /**
    * @param otherModuleId The ID of the other module
    * @return Whether this module depends on another one
    */
   dependsOn(otherModuleId: string): boolean;
}