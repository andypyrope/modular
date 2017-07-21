import { XmlObject } from "./../XmlObject";
import { AdaptedData } from "./../core/AdaptedData";

export class XmlObjectBuilder {
   public static instantiate<T extends XmlObject>(data: AdaptedData, type: any): T {
      return new type(data);
   }

   public static instantiateMultiple<T extends XmlObject>(dataArray: AdaptedData[],
      type: any): T[] {
      let result: T[] = [];

      for (let data of dataArray) {
         result.push(new type(data));
      }

      return result;
   }
}