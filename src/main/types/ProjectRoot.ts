import { NotEmpty, ValidateNested } from "validator.ts/decorator/Validation";
import { LibModule } from "./LibModule";
import { PageModule } from "./PageModule";
import { XmlObjectBase } from "./XmlObjectBase";

export class ProjectRoot extends XmlObjectBase {
   @NotEmpty()
   webpackFile: string;

   @NotEmpty()
   tsFolder: string;

   @NotEmpty()
   stylesFolder: string;

   @ValidateNested()
   libModules: LibModule[];

   @ValidateNested()
   pageModules: PageModule[];

   protected initialize(): void {
      this.webpackFile = this.getAttribute("webpackFile");
      this.tsFolder = this.getAttribute("tsFolder");
      this.stylesFolder = this.getAttribute("stylesFolder");

      this.libModules = this.getChildren<LibModule>(LibModule);
      this.pageModules = this.getChildren<PageModule>(PageModule);
   }


}