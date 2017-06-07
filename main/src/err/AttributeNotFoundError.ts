import { XmlObjectBuildingError } from "./XmlObjectBuildingError";
import { XmlObject } from "./../XmlObject";
import { FormattedString } from "./../util/FormattedString";

export class AttributeNotFoundError extends XmlObjectBuildingError {
   constructor(attributeName: string, source: XmlObject) {
      super(new FormattedString(
         "Attribute '{0}' is not defined in XML object: {1}",
         attributeName, source.identification()).toNative());
      this.resetPrototype(AttributeNotFoundError);
   }
}