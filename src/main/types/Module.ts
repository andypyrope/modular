import { XmlObjectBase } from "./base/XmlObjectBase";
import { Dependency } from "./Dependency";
import * as path from "path";
import { KebabCaseAssertion } from "./../assertions/KebabCaseAssertion";
import { NotEmptyAssertion } from "./../assertions/NotEmptyAssertion";
import { ModuleType } from "./ModuleType";
import { InvalidModuleTypeError } from "./../err/InvalidModuleTypeError";

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
   type: ModuleType;

   private static readonly AVAILABLE_TYPES: ModuleType[] = [
      ModuleType.CONTRACT, ModuleType.GROUP, ModuleType.SERVER, ModuleType.UI
   ];

   protected initialize(): void {
      this.id = this.data.getAttribute("id", [new KebabCaseAssertion()]);
      this.dependencies = this.instantiateChildren<Dependency>(Dependency);

      const TYPE_MAPPING: {[asString: string]: ModuleType} = {};
      for (let type of Module.AVAILABLE_TYPES) {
         TYPE_MAPPING[type] = type;
      }

      const TYPE_AS_STRING: string = this.data.getAttribute("type",
         [new NotEmptyAssertion()]);
      if (!TYPE_MAPPING[TYPE_AS_STRING]) {
         throw new InvalidModuleTypeError(TYPE_AS_STRING, Object.keys(TYPE_MAPPING));
      }
      this.type = TYPE_MAPPING[TYPE_AS_STRING];
   }

   public setParentDirectory(directory: string): void {
      this.directory = path.join(directory, this.id);
   }
}