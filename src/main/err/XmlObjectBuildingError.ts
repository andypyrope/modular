import { ErrorBase } from "./ErrorBase";

/**
 * An error thrown while building an XmlObject from parsed XML
 *
 * @export
 * @class XmlObjectBuildingError
 * @extends {ErrorBase}
 */
export class XmlObjectBuildingError extends ErrorBase {
   constructor(message?: string) {
      super(message);
      this.resetPrototype(XmlObjectBuildingError);
   }
}