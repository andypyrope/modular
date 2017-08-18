import { Directory } from "./Directory";
import { XmlObjectBase } from "./base/XmlObjectBase";
import { NotEmptyAssertion } from "./../assertions/NotEmptyAssertion";
import { Module } from "./Module";
import { DuplicateModuleIdError } from "./../err/DuplicateModuleIdError";

/**
 * The project root. It contains all the default configurations for all modules as well
 * as the modules themselves. It should be the output of the Parser.
 *
 * @export
 * @class ProjectRoot
 * @extends {XmlObjectBase}
 */
export class ProjectRoot extends XmlObjectBase {
   webpackFile: string;
   tsFolder: string;
   stylesFolder: string;

   rootDirectory: Directory;

   protected initialize(): void {
      this.webpackFile =
         this.data.getAttribute("webpackFile", [new NotEmptyAssertion()]);

      this.tsFolder = this.data.getAttribute("tsFolder", [new NotEmptyAssertion()]);

      this.stylesFolder =
         this.data.getAttribute("stylesFolder", [new NotEmptyAssertion()]);

      this.rootDirectory = this.instantiateChild<Directory>(Directory);

      const ALL_MODULES: {[id: string]: Module} = {};
      for (let module of this.rootDirectory.allModules) {
         if (ALL_MODULES[module.id]) {
            throw new DuplicateModuleIdError(module.id);
         }
         ALL_MODULES[module.id] = module;
      }
   }
}