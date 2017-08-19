import { ErrorBase } from "./base/ErrorBase";

/**
 * An error thrown if there is a cyclic dependency between modules.
 *
 * @export
 * @class CyclicDependencyError
 * @extends {ErrorBase}
 */
export class CyclicDependencyError extends ErrorBase {
   constructor(depdendencyChain: string[]) {
      super("There is the following cyclic dependency: " +
         depdendencyChain.join(" -> "));
      this.resetPrototype(CyclicDependencyError);
   }
}