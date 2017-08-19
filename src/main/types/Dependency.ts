import { XmlObjectBase } from "./base/XmlObjectBase";
import { KebabCaseAssertion } from "./../assertions/KebabCaseAssertion";

/**
 * An XML object describing a dependency to a module. It only contains data
 * about the module that is being depended on because it is assumed that the Dependency
 * instances are only inside the module that depends on the specified module.
 *
 * @export
 * @class Dependency
 * @extends {XmlObjectBase}
 */
export class Dependency extends XmlObjectBase {
   id: string;

   protected initialize(): void {
      this.id = this.data.getContent([new KebabCaseAssertion()]);
   }
}