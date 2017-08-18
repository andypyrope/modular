import { ErrorBase } from "./base/ErrorBase";

/**
 * An error thrown if there is more than one module with the same ID.
 *
 * @export
 * @class DuplicateModuleIdError
 * @extends {ErrorBase}
 */
export class DuplicateModuleIdError extends ErrorBase {
   constructor(moduleId: string) {
      super("There is more than one module with ID '" + moduleId + "'");
      this.resetPrototype(DuplicateModuleIdError);
   }
}