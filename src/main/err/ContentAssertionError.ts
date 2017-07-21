import { XmlObjectError } from "./XmlObjectError";
import { FormattedString } from "./../util/FormattedString";
import { Assertion } from "./../assertions/Assertion";

export class ContentAssertionError extends XmlObjectError {
   constructor(attributeName: string, assertion: Assertion, xmlObjectLocation: string) {
      const message: string = new FormattedString(
         "The content does not comply with the assertion '{0}'",
         assertion.message()
      ).toNative();

      super(message, xmlObjectLocation);

      this.resetPrototype(ContentAssertionError);
   }
}