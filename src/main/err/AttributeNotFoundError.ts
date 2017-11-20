import { XmlObjectError } from "./XmlObjectError";
import { FormattedString } from "../util/FormattedString";

export class AttributeNotFoundError extends XmlObjectError {
   constructor(attributeName: string, xmlObjectLocation: string) {
      const message: string = new FormattedString(
         "Attribute '{0}' is not defined",
         attributeName
      ).toNative();

      super(message, xmlObjectLocation);

      this.resetPrototype(AttributeNotFoundError);
   }
}