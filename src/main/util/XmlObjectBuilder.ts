import { XmlObject } from "./../XmlObject";

export class XmlObjectBuilder {
   public static instantiate<T extends XmlObject>(data: any, type: any,
      parent: XmlObject): T {
      return new type(data, parent);
   }
}