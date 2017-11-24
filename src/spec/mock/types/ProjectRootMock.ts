import { ProjectRoot } from "../../../main/types/ProjectRoot";
import { Directory } from "../../../main/types/Directory";
import { Module } from "../../../main/types/Module";
import { DirectoryMock } from "./DirectoryMock";

export class ProjectRootMock implements ProjectRoot {
   constructor(
      public rootDirectory: Directory = new DirectoryMock(),
      public modules: { readonly [id: string]: Module } = {}) {
   }

   allModulesOfType(): Module[] {
      return [];
   }

   getDependentModuleIds(module: Module | string): string[] {
      return [];
   }

   getBuildOrder(): (string | string[])[] {
      return [];
   }
}