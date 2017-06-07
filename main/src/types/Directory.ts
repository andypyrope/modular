import { XmlObjectBase } from "./XmlObjectBase";
import { NotEmpty, ValidateNested } from "validator.ts/decorator/Validation";
import { LibModule } from "./LibModule";
import { PageModule } from "./PageModule";
import { Module } from "./Module";
import * as path from "path";

export class Directory extends XmlObjectBase {
   private path: string;

   // Recursively obtained
   allModules: Module[];
   allLibModules: LibModule[];
   allPageModules: PageModule[];

   @NotEmpty()
   private name: string;

   @ValidateNested()
   directories: Directory[];

   modules: Module[];

   @ValidateNested()
   libModules: LibModule[];

   @ValidateNested()
   pageModules: PageModule[];

   protected initialize(): void {
      this.name = this.getAttribute("name");
      this.directories = this.getChildren<Directory>(Directory);
      this.libModules = this.getChildren<LibModule>(LibModule);
      this.pageModules = this.getChildren<PageModule>(PageModule);
      this.modules = (this.libModules as Module[]).concat(this.pageModules);

      this.allLibModules = this.libModules.slice();
      this.allPageModules = this.pageModules.slice();
      for (let directory of this.directories) {
         this.allLibModules = this.allLibModules.concat(directory.allLibModules);
         this.allPageModules = this.allPageModules.concat(directory.allPageModules);
      }
      this.allModules = (this.allLibModules as Module[]).concat(this.allPageModules);
   }

   public setPathBase(pathBase: string): void {
      this.path = path.join(pathBase, this.name);
      for (let directory of this.directories) {
         directory.setPathBase(this.path);
      }
      for (let module of this.allModules) {
         module.setDirectory(this.path);
      }
   }
}