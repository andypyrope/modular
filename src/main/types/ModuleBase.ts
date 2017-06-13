import { Module } from "./Module";
import { NotEmpty, ValidateNested, IsLowercase, Matches } from "validator.ts/decorator/Validation";
import { XmlObjectBase } from "./XmlObjectBase";
import { Dependency } from "./Dependency";
import * as path from "path";

export abstract class ModuleBase extends XmlObjectBase implements Module {
   @NotEmpty()
   @IsLowercase()
   @Matches(/\w+(-\w)*/)
   id: string;

   @ValidateNested()
   dependencies: Dependency[];

   @NotEmpty()
   directory: string;

   protected initialize(): void {
      this.id = this.getAttribute("id");
      this.dependencies = this.getChildren<Dependency>(Dependency);
   }

   public setDirectory(directory: string): void {
      this.directory = path.join(directory);
   }
}