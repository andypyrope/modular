import { XmlObjectBuildingError } from "./XmlObjectBuildingError";
import { XmlObject } from "./../XmlObject";
import { FormattedString } from "./../util/FormattedString";

export class ExpectedSingleChildError extends XmlObjectBuildingError {
   constructor(childType: string, actualCount: number, source: XmlObject) {
      super(new FormattedString(
         "Expected one child of type '{0}', but found {1} in XML object: {2}",
         childType, actualCount.toString(), source.identification()).toNative());
      this.resetPrototype(ExpectedSingleChildError);
   }
}