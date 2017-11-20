import { AdaptedData } from "../../../core/AdaptedData";
import { XmlObject } from "../../../XmlObject";
import { XmlObjectBuilder } from "../../../util/XmlObjectBuilder";
import { XmlObjectClass } from "../../../core/XmlObjectClass";

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
    * @param {AdaptedData} data
    * @memberof XmlObjectBase
    */
   constructor(protected data: AdaptedData) {
   }

   protected instantiateChild<T extends XmlObject>(clazz: XmlObjectClass<T, void>): T {
      return XmlObjectBuilder
         .instantiate<T, void>(this.getSingleChild(clazz), clazz, undefined);
   }

   protected instantiateChildWithData<T extends XmlObject, Q>(
      clazz: XmlObjectClass<T, Q>, additional: Q): T {

      return XmlObjectBuilder
         .instantiate<T, Q>(this.getSingleChild(clazz), clazz, additional);
   }

   protected instantiateChildren<T extends XmlObject>(clazz: XmlObjectClass<T, void>):
      T[] {

      return XmlObjectBuilder
         .instantiateMultiple<T, void>(this.getChildren(clazz), clazz, undefined);
   }

   protected instantiateChildrenWithData<T extends XmlObject, Q>(
      clazz: XmlObjectClass<T, Q>, additional: Q): T[] {

      return XmlObjectBuilder
         .instantiateMultiple<T, Q>(this.getChildren(clazz), clazz, additional);
   }

   private getSingleChild(clazz: XmlObjectClass<any, any>): AdaptedData {
      return this.data.getSingleChild(XmlObjectBase.getTagname(clazz));
   }

   private getChildren(clazz: XmlObjectClass<any, any>): AdaptedData[] {
      return this.data.getChildren(XmlObjectBase.getTagname(clazz));
   }

   private static getTagname(clazz: any): string {
      return (clazz.name as string).replace(/Impl$/, "");
   }
}