import { XmlObjectBuildingError } from "./XmlObjectBuildingError";
import { XmlObject } from "./../XmlObject";
import { FormattedString } from "./../util/FormattedString";

export class NoTextContentError extends XmlObjectBuildingError {
   constructor(source: XmlObject) {
      super(new FormattedString(
         "Tried to fetch text content but there is none in XML object: {0}",
         source.identification()).toNative());
      this.resetPrototype(NoTextContentError);
   }
}