import { XmlObjectBase } from "./base/XmlObjectBase";
import { ModuleImpl } from "./ModuleImpl";
import { Module } from "./../Module";
import { Directory } from "../Directory";
import * as path from "path";
import { NotEmptyAssertion } from "../../assertions/NotEmptyAssertion";
import { DuplicateModuleIdError } from "../../err/DuplicateModuleIdError";
import { AdaptedData } from "../../core/AdaptedData";

export class DirectoryImpl extends XmlObjectBase implements Directory {
   readonly dirPath: string;
   readonly dirName: string;
   readonly directModules: Module[];
   readonly directDirectories: Directory[];

   readonly modules: { [id: string]: Module };

   constructor(data: AdaptedData, parentPath: string) {
      super(data);
      this.dirName = data.getAttribute("name", [new NotEmptyAssertion()]);
      this.dirPath = path.join(parentPath, this.dirName);

      this.directDirectories = this.instantiateChildrenWithData<Directory, string>(
         DirectoryImpl, this.dirPath);
      this.directModules = this.instantiateChildrenWithData<Module, string>(
         ModuleImpl, this.dirPath);

      this.modules = {};
      for (let module of this.directModules) {
         this.addModule(module);
      }

      for (let directory of this.directDirectories) {
         for (let id in directory.modules) {
            this.addModule(directory.modules[id]);
         }
      }
   }

   private addModule(module: Module): void {
      if (this.modules[module.id]) {
         throw new DuplicateModuleIdError(module.id, this.dirName);
      }

      this.modules[module.id] = module;
   }
}