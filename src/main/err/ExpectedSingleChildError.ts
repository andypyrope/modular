import { XmlObjectError } from "./XmlObjectError";
import { FormattedString } from "./../util/FormattedString";

export class ExpectedSingleChildError extends XmlObjectError {
   constructor(childType: string, actualCount: number, xmlObjectLocation: string) {
      const message: string = new FormattedString(
         "Expected one child of type '{0}', but found {1}",
         childType, actualCount.toString()
      ).toNative();

      super(message, xmlObjectLocation);

      this.resetPrototype(ExpectedSingleChildError);
   }
}