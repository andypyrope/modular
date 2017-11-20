import { XmlObject } from "../XmlObject";
import { AdaptedData } from "./AdaptedData";

export type XmlObjectClass<T extends XmlObject, Q> = {
   new(data: AdaptedData, additionalData: Q): T
};