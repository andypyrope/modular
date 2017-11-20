import { XmlObject } from "../../main/XmlObject";
import { AdaptedData } from "../../main/core/AdaptedData";

export class MockXmlObjectWithAdditional implements XmlObject {
   constructor(readonly data: AdaptedData, readonly additional: number) {
   }
}