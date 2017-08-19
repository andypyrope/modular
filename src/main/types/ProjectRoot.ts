import { Directory } from "./Directory";
import { XmlObjectBase } from "./base/XmlObjectBase";
import { NotEmptyAssertion } from "./../assertions/NotEmptyAssertion";
import { ModuleType } from "./ModuleType";
import { CyclicDependencyError } from "./../err/CyclicDependencyError";
import { InvalidDependencyTypeError } from "./../err/InvalidDependencyTypeError";
import { DependencyDoesNotExistError } from "./../err/DependencyDoesNotExistError";
import { Module } from "./Module";

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

   private rootDirectory: Directory;

   private ALLOWED_DEPENDENCIES: { [from: string]: ModuleType[] };

   protected initialize(): void {
      this.webpackFile =
         this.data.getAttribute("webpackFile", [new NotEmptyAssertion()]);

      this.tsFolder = this.data.getAttribute("tsFolder", [new NotEmptyAssertion()]);

      this.stylesFolder =
         this.data.getAttribute("stylesFolder", [new NotEmptyAssertion()]);

      this.ALLOWED_DEPENDENCIES = {};
      this.ALLOWED_DEPENDENCIES[ModuleType.UI] = [ModuleType.CONTRACT, ModuleType.UI];
      this.ALLOWED_DEPENDENCIES[ModuleType.CONTRACT] = [ModuleType.CONTRACT];
      this.ALLOWED_DEPENDENCIES[ModuleType.SERVER] = [
         ModuleType.CONTRACT, ModuleType.SERVER
      ];
      this.ALLOWED_DEPENDENCIES[ModuleType.GROUP] = [
         ModuleType.CONTRACT, ModuleType.SERVER, ModuleType.UI, ModuleType.GROUP
      ];

      this.rootDirectory = this.instantiateChild<Directory>(Directory);
      for (let id in this.rootDirectory.modules) {
         this.verifyDependencies(this.rootDirectory.modules[id], [id]);
      }
   }

   private verifyDependencies(currentModule: Module, visited: string[]): void {
      for (let dependency of currentModule.dependencies) {
         if (!this.rootDirectory.modules[dependency.id]) {
            throw new DependencyDoesNotExistError(currentModule.id, dependency.id);
         }
         if (visited.indexOf(dependency.id) > -1) {
            throw new CyclicDependencyError(visited
               .slice(visited.lastIndexOf(dependency.id))
               .concat([dependency.id]));
         }
         if (this.ALLOWED_DEPENDENCIES[currentModule.type].indexOf(
            this.rootDirectory.modules[dependency.id].type) === -1) {
            throw new InvalidDependencyTypeError(currentModule.id, dependency.id,
               this.ALLOWED_DEPENDENCIES[currentModule.type]);
         }
         visited.push(dependency.id);
         this.verifyDependencies(this.rootDirectory.modules[dependency.id], visited);
         visited.pop();
      }
   }
}