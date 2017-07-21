import { XmlObjectBase } from "./base/XmlObjectBase";
import { Dependency } from "./Dependency";
import * as path from "path";
import { KebabCaseAssertion } from "./../assertions/KebabCaseAssertion";
import { NotEmptyAssertion } from "./../assertions/NotEmptyAssertion";

/**
 * A module.
 *
 * @export
 * @class Module
 * @extends {XmlObjectBase}
 */
export class Module extends XmlObjectBase {
   id: string;
   dependencies: Dependency[];
   directory: string;

   protected initialize(): void {
      this.id = this.data.getAttribute("id", [new KebabCaseAssertion()]);
      this.dependencies = this.instantiateChildren<Dependency>(Dependency);
   }

   public setParentDirectory(directory: string): void {
      this.directory = path.join(directory, this.id);
   }
}