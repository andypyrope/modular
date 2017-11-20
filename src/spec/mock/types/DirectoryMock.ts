import { Module } from "../../../main/types/Module";
import { Directory } from "../../../main/types/Directory";
import * as path from "path";

export class DirectoryMock implements Directory {
   readonly dirName: string;

   constructor(
      public dirPath: string = "",
      public directModules: ReadonlyArray<Module> = [],
      public directDirectories: ReadonlyArray<Directory> = [],
      public modules: { [id: string]: Module } = {}) {

      for (const module of directModules) {
         modules[module.id] = module;
      }

      this.dirName = dirPath.substr(dirPath.lastIndexOf(path.sep));
   }
}