import { ErrorBase } from "./base/ErrorBase";

/**
 * An error thrown if the type of a module is invalid.
 *
 * @export
 * @class InvalidModuleTypeError
 * @extends {ErrorBase}
 */
export class InvalidModuleTypeError extends ErrorBase {
   constructor(actualType: string, availableTypes: string[]) {
      super("Module type '" + actualType + "' is invalid because the only possible " +
         "types are: " + availableTypes.join(", "));
      this.resetPrototype(InvalidModuleTypeError);
   }
}