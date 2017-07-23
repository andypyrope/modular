import { AdaptedData } from "./../../core/AdaptedData";
import { XmlObject } from "./../../XmlObject";
import { XmlObjectBuilder } from "./../../util/XmlObjectBuilder";
import { XmlObjectClass } from "./../../core/XmlObjectClass";

/**
 * The base abstract class all concrete XML object classes should extend.
 *
 * @export
 * @abstract
 * @class XmlObjectBase
 * @implements {XmlObject}
 */
export abstract class XmlObjectBase implements XmlObject {
   /**
    * Creates an instance of this XML object type.
    *
    * Instantiating with null or undefined data causes the 'initialize' method to never
    * be called and turning this object into a shell, ready to be mocked in unit tests.
    *
    * Another way to make mocking possible is to extend every single concrete XML object
    * type, but that is a much bigger overhead than ensuring that the "truthiness" check
    * upon the 'data' parameter works.
    *
    * @param {AdaptedData} data
    * @memberof XmlObjectBase
    */
   constructor(protected data: AdaptedData) {
      if (data) {
         this.initialize();
      }
   }

   protected instantiateChild<T extends XmlObject>(clazz: XmlObjectClass<T>): T {
      let tagname: string = (clazz as any).name;
      return XmlObjectBuilder
         .instantiate<T>(this.data.getSingleChild(tagname), clazz);
   }

   protected instantiateChildren<T extends XmlObject>(clazz: XmlObjectClass<T>): T[] {
      let tagname: string = (clazz as any).name;
      return XmlObjectBuilder
         .instantiateMultiple<T>(this.data.getChildren(tagname), clazz);
   }

   protected abstract initialize(): void;
}