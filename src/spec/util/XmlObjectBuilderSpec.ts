import { XmlObjectBuilder } from "../../main/util/XmlObjectBuilder";
import { MockXmlObject } from "../mock/MockXmlObject";
import { AdaptedData } from "../../main/core/AdaptedData";
import { MockUtil } from "../mock/MockUtil";
import { MockXmlObjectWithAdditional } from "../mock/MockXmlObjectWithAdditional";

interface SS {
}

describe("XmlObjectBuilder", () => {
   describe("#instantiate", () => {
      describe("WHEN 3 objects are instantiated one after another", () => {
         it("THEN it instantiates them with the correct data", function (this: SS): void {
            const data12: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const result1: MockXmlObject =
               XmlObjectBuilder.instantiate<MockXmlObject, void>(
                  data12, MockXmlObject, undefined);
            const result2: MockXmlObject =
               XmlObjectBuilder.instantiate<MockXmlObject, void>(
                  data12, MockXmlObject, undefined);

            const data3: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const result3: MockXmlObject =
               XmlObjectBuilder.instantiate<MockXmlObject, void>(
                  data3, MockXmlObject, undefined);

            expect(result1.data).toBe(data12);
            expect(result2.data).toBe(data12);
            expect(result3.data).toBe(data3);
         });
      });

      describe("WHEN it is called with an object that requires additional data", () => {
         it("THEN it passes that additional data to the constructor", function (this: SS): void {
            const result: MockXmlObjectWithAdditional =
               XmlObjectBuilder.instantiate<MockXmlObjectWithAdditional, number>(
                  MockUtil.adaptedDataWithRandomContent(),
                  MockXmlObjectWithAdditional,
                  8);
            expect(result.additional).toBe(8);
         });
      });
   });

   describe("#instantiateMultiple", () => {
      describe("WHEN 3 objecst are instantiated at once", () => {
         it("THEN it instantiates them with the correct data", function (this: SS): void {
            const data13: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const data2: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const data: AdaptedData[] = [data13, data2, data13];
            const result: MockXmlObject[] =
               XmlObjectBuilder.instantiateMultiple<MockXmlObject, void>(
                  data, MockXmlObject, undefined);

            expect(result.length).toBe(data.length);
            expect(result[0].data).toBe(data[0]);
            expect(result[1].data).toBe(data[1]);
            expect(result[2].data).toBe(data[2]);
         });
      });

      describe("WHEN it is called with an object that requires additional data", () => {
         it("THEN it passes that additional data to the constructor", function (this: SS): void {
            const data: AdaptedData[] = [
               MockUtil.adaptedDataWithRandomContent(),
               MockUtil.adaptedDataWithRandomContent()
            ];
            const result: MockXmlObjectWithAdditional[] =
               XmlObjectBuilder.instantiateMultiple<MockXmlObjectWithAdditional, number>(
                  data, MockXmlObjectWithAdditional, 8);
            expect(result.length).toBe(2);
            expect(result[0].additional).toBe(8);
            expect(result[1].additional).toBe(8);
         });
      });
   });
});