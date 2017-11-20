import { XmlObjectError } from "./XmlObjectError";
import { FormattedString } from "../util/FormattedString";
import { Assertion } from "../assertions/Assertion";

export class AttributeAssertionError extends XmlObjectError {
   constructor(attributeName: string, assertion: Assertion, xmlObjectLocation: string) {
      const message: string = new FormattedString(
         "Attribute '{0}' does not comply with the assertion '{1}'",
         attributeName, assertion.message()
      ).toNative();

      super(message, xmlObjectLocation);

      this.resetPrototype(AttributeAssertionError);
   }
}