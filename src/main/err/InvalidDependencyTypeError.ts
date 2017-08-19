import { ErrorBase } from "./base/ErrorBase";

/**
 * An error thrown if a module depends on a module of an incompatible type.
 *
 * @export
 * @class InvalidDependencyTypeError
 * @extends {ErrorBase}
 */
export class InvalidDependencyTypeError extends ErrorBase {
   constructor(sourceModuleId: string, targetModuleId: string, allowedTypes: string[]) {
      super("Module '" + sourceModuleId + "' cannot depend on module '" +
         targetModuleId + "'. The only types it can depend on are: " +
         allowedTypes.join(", "));
      this.resetPrototype(InvalidDependencyTypeError);
   }
}