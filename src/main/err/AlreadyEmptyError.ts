import { ErrorBase } from "./base/ErrorBase";

/**
 * An error thrown when trying to extract an element from a container that is already
 * empty.
 *
 * @export
 * @class AlreadyEmptyError
 * @extends {ErrorBase}
 */
export class AlreadyEmptyError extends ErrorBase {
   constructor() {
      super("The container is already empty. You cannot extract any elements from it.");
      this.resetPrototype(AlreadyEmptyError);
   }
}