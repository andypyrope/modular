import { NotEmpty, IsLowercase, Matches } from "validator.ts/decorator/Validation";
import { XmlObjectBase } from "./XmlObjectBase";

export class Dependency extends XmlObjectBase {
   @NotEmpty()
   @IsLowercase()
   @Matches(/\w+(-\w)*/)
   id: string;

   protected initialize(): void {
      this.id = this.getTextContent();
   }

   public getId(): string {
      return this.id;
   }
}