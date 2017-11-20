import { Module } from "../../../main/types/Module";
import { Dependency } from "../../../main/types/Dependency";
import { ModuleType } from "../../../main/ModuleType";

export class ModuleMock implements Module {
   static currentId: number = 0;

   constructor(
      public id: string = "module-" + ModuleMock.currentId++,
      public dependencies: Dependency[] = [],
      public directory: string = "",
      public type: ModuleType = ModuleType.UI) {
   }
}