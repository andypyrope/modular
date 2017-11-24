import { XmlObjectBase } from "./base/XmlObjectBase";
import { Dependency } from "../Dependency";
import { Module } from "../Module";
import { DependencyImpl } from "./DependencyImpl";
import * as path from "path";
import { KebabCaseAssertion } from "../../assertions/KebabCaseAssertion";
import { NotEmptyAssertion } from "../../assertions/NotEmptyAssertion";
import { ModuleType } from "../../ModuleType";
import { InvalidModuleTypeError } from "../../err/InvalidModuleTypeError";
import { AdaptedData } from "../../core/AdaptedData";

export class ModuleImpl extends XmlObjectBase implements Module {
   readonly id: string;
   readonly dependencies: Dependency[];
   readonly directory: string;
   readonly type: ModuleType;

   private static readonly AVAILABLE_TYPES: ModuleType[] = [
      ModuleType.CONTRACT, ModuleType.GROUP, ModuleType.SERVER, ModuleType.UI
   ];

   constructor(data: AdaptedData, parentPath: string) {
      super(data);
      this.id = data.getAttribute("id", [new KebabCaseAssertion()]);

      const typeMapping: {[asString: string]: ModuleType} = {};
      for (let type of ModuleImpl.AVAILABLE_TYPES) {
         typeMapping[type] = type;
      }

      const typeAsString: string = data.getAttribute("type", [new NotEmptyAssertion()]);

      if (!typeMapping[typeAsString]) {
         throw new InvalidModuleTypeError(typeAsString, Object.keys(typeMapping));
      }

      this.type = typeMapping[typeAsString];
      this.directory = path.join(parentPath, this.id);
      this.dependencies = this.instantiateChildren<Dependency>(DependencyImpl);
   }

   public dependsOn(otherModuleId: string): boolean {
      for (const dependency of this.dependencies) {
         if (dependency.id === otherModuleId) {
            return true;
         }
      }

      return false;
   }
}