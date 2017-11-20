import { XmlObject } from "../XmlObject";
import { AdaptedData } from "../core/AdaptedData";
import { XmlObjectClass } from "../core/XmlObjectClass";

export class XmlObjectBuilder {
   static instantiate<T extends XmlObject, Q>(data: AdaptedData,
      clazz: XmlObjectClass<T, Q>, additionalData: Q): T {
      return new clazz(data, additionalData);
   }

   static instantiateMultiple<T extends XmlObject, Q>(dataArray: AdaptedData[],
      clazz: XmlObjectClass<T, Q>, additional: Q): T[] {
      let result: T[] = [];

      for (let data of dataArray) {
         result.push(new clazz(data, additional));
      }

      return result;
   }
}