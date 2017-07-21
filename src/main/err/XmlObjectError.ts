import { ErrorBase } from "./base/ErrorBase";

/**
 * An error thrown while building an XmlObject from parsed XML
 *
 * @export
 * @class XmlObjectError
 * @extends {ErrorBase}
 */
export class XmlObjectError extends ErrorBase {
   constructor(message: string, xmlObjectLocation: string) {
      super(message + " (in XML object " + xmlObjectLocation + ")");

      this.resetPrototype(XmlObjectError);
   }
}