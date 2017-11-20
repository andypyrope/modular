import { XmlObjectBuilder } from "../../main/util/XmlObjectBuilder";
import { XmlObject } from "../../main/XmlObject";
import { AdaptedData } from "../../main/core/AdaptedData";
import { AdaptedDataImpl } from "../../main/core/AdaptedDataImpl";

export class MockUtil {
   private static mockTable: { [id: string]: XmlObject } = {};

   static adaptedDataWithRandomContent(): AdaptedData {
      return new AdaptedDataImpl(this.randomString(10), {}, {}, "MOCK");
   }

   static registerAll(objects: XmlObject[] | XmlObject): AdaptedData[] {
      if (!(objects instanceof Array)) {
         throw new Error("Expected array.");
      }
      let result: AdaptedData[] = [];
      for (let object of objects) {
         if (object) {
            result.push(this.registerMock(object));
         }
      }
      return result;
   }

   static registerMock(object: XmlObject): AdaptedData {
      const id: string = "mock:" + this.randomString(5);
      expect(this.mockTable[id]).not.toBeDefined();
      this.mockTable[id] = object;

      return new AdaptedDataImpl(id, {}, {}, "MOCK");
   }

   static initialize(): void {
      spyOn(XmlObjectBuilder, "instantiate").and.callFake(
         (data: AdaptedData, type: any): XmlObject => {
            return this.getSingleMock(data);
         });

      spyOn(XmlObjectBuilder, "instantiateMultiple").and.callFake(
         (dataArray: AdaptedData[], type: any): XmlObject[] => {
            let result: XmlObject[] = [];

            for (let data of dataArray) {
               result.push(this.getSingleMock(data));
            }

            return result;
         });
   }

   private static getSingleMock(data: AdaptedData): XmlObject {
      let mockId: string = data.getContent();
      expect(mockId).toContain("mock:");
      expect(this.mockTable[mockId]).toBeDefined();

      return this.mockTable[mockId];
   }

   private static randomString(length: number): string {
      let result: string = "";
      for (let i: number = 0; i < length; ++i) {
         result += Math.floor(Math.random() * 1000000000) % 10;
      }
      return result;
   }
}