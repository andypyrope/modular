import { XmlObject } from "./../../main/XmlObject";
import { AdaptedData } from "./../../main/core/AdaptedData";

export class MockXmlObject implements XmlObject {
   constructor(public readonly data: AdaptedData) {
   }
}