import { Module } from "../../../main/types/Module";
import { Dependency } from "../../../main/types/Dependency";
import { ModuleType } from "../../../main/ModuleType";
import { DependencyMock } from "./DependencyMock";

export class ModuleMock implements Module {
   static currentId: number = 0;
   public dependencies: Dependency[] = [];

   constructor(
      public id: string = "module-" + ModuleMock.currentId++,
      private dependencyIds: string[] = [],
      public directory: string = "",
      public type: ModuleType = ModuleType.UI) {

      for (const dependencyId of dependencyIds) {
         this.dependencies.push(new DependencyMock(dependencyId));
      }
   }

   dependsOn(otherModuleId: string): boolean {
      return this.dependencyIds.indexOf(otherModuleId) > -1;
   }
}