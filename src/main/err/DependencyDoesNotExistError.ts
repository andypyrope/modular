import { ErrorBase } from "./base/ErrorBase";

/**
 * An error thrown if there is more than one module with the same ID.
 *
 * @export
 * @class DependencyDoesNotExistError
 * @extends {ErrorBase}
 */
export class DependencyDoesNotExistError extends ErrorBase {
   constructor(moduleId: string, otherModuleId: string) {
      super("Module '" + moduleId + "' depends on '" + otherModuleId +
         "' which does not exist");
      this.resetPrototype(DependencyDoesNotExistError);
   }
}