import { XmlObjectBase } from "./base/XmlObjectBase";
import { Module } from "./Module";
import * as path from "path";
import { NotEmptyAssertion } from "./../assertions/NotEmptyAssertion";

/**
 * Represents a real-life directory in the file system, which can contain subdirectories
 * and modules. It, of course, has a name as well.
 *
 * @export
 * @class Directory
 * @extends {XmlObjectBase}
 */
export class Directory extends XmlObjectBase {
   private path: string;
   private name: string;
   private modules: Module[];

   directories: Directory[];

   // Recursively obtained
   allModules: Module[];

   protected initialize(): void {
      this.name = this.data.getAttribute("name", [new NotEmptyAssertion()]);

      this.directories = this.instantiateChildren<Directory>(Directory);
      this.modules = this.instantiateChildren<Module>(Module);

      this.allModules = this.modules.slice();
      for (let directory of this.directories) {
         this.allModules = this.allModules.concat(directory.allModules);
      }
   }

   public setParentDirectory(parentDirectory: string): void {
      this.path = path.join(parentDirectory, this.name);
      for (let directory of this.directories) {
         directory.setParentDirectory(this.path);
      }
      for (let currentModule of this.modules) {
         currentModule.setParentDirectory(this.path);
      }
   }
}