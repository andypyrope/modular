import { XmlObject } from "./../XmlObject";
import { AdaptedData } from "./../core/AdaptedData";
import { XmlObjectClass } from "./../core/XmlObjectClass";

export class XmlObjectBuilder {
   public static instantiate<T extends XmlObject>(data: AdaptedData,
      clazz: XmlObjectClass<T>): T {
      return new clazz(data);
   }

   public static instantiateMultiple<T extends XmlObject>(dataArray: AdaptedData[],
      clazz: XmlObjectClass<T>): T[] {
      let result: T[] = [];

      for (let data of dataArray) {
         result.push(new clazz(data));
      }

      return result;
   }
}