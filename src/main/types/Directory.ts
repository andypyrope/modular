import { XmlObjectBase } from "./base/XmlObjectBase";
import { Module } from "./Module";
import * as path from "path";
import { NotEmptyAssertion } from "./../assertions/NotEmptyAssertion";
import { DuplicateModuleIdError } from "./../err/DuplicateModuleIdError";

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
   private directModules: Module[];
   private directories: Directory[];

   modules: {[id: string]: Module};

   protected initialize(): void {
      this.name = this.data.getAttribute("name", [new NotEmptyAssertion()]);

      this.directories = this.instantiateChildren<Directory>(Directory);
      this.directModules = this.instantiateChildren<Module>(Module);

      this.modules = {};
      for (let module of this.directModules) {
         this.addModule(module);
      }
      for (let directory of this.directories) {
         for (let id in directory.modules) {
            this.addModule(directory.modules[id]);
         }
      }
   }

   private addModule(module: Module): void {
      if (this.modules[module.id]) {
         throw new DuplicateModuleIdError(module.id, this.name);
      }
      this.modules[module.id] = module;
   }

   public setParentDirectory(parentDirectory: string): void {
      this.path = path.join(parentDirectory, this.name);
      for (let directory of this.directories) {
         directory.setParentDirectory(this.path);
      }
      for (let module of this.directModules) {
         module.directory = path.join(this.path, module.id);
      }
   }
}