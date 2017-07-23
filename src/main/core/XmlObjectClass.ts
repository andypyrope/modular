import { XmlObject } from "./../XmlObject";
import { AdaptedData } from "./AdaptedData";

export type XmlObjectClass<T extends XmlObject> = {
   new(data: AdaptedData): T
};