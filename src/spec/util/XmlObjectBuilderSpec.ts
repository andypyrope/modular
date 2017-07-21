import { XmlObjectBuilder } from "./../../main/util/XmlObjectBuilder";
import { MockXmlObject } from "./../mock/MockXmlObject";
import { AdaptedData } from "./../../main/core/AdaptedData";
import { MockUtil } from "./../mock/MockUtil";

describe("XmlObjectBuilder", () => {
   describe("#instantiate", () => {
      describe("WHEN 3 objects are instantiated one after another", () => {
         it("THEN it instantiates them with the correct data", function (): void {
            const DATA_12: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const RESULT_1: MockXmlObject =
               XmlObjectBuilder.instantiate<MockXmlObject>(DATA_12, MockXmlObject);
            const RESULT_2: MockXmlObject =
               XmlObjectBuilder.instantiate<MockXmlObject>(DATA_12, MockXmlObject);

            const DATA_3: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const RESULT_3: MockXmlObject =
               XmlObjectBuilder.instantiate<MockXmlObject>(DATA_3, MockXmlObject);

            expect(RESULT_1.data).toBe(DATA_12);
            expect(RESULT_2.data).toBe(DATA_12);
            expect(RESULT_3.data).toBe(DATA_3);
         });
      });
   });

   describe("#instantiateMultiple", () => {
      describe("WHEN 3 objecst are instantiated at once", () => {
         it("THEN it instantiates them with the correct data", function (): void {
            const DATA_13: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const DATA_2: AdaptedData = MockUtil.adaptedDataWithRandomContent();
            const DATA: AdaptedData[] = [DATA_13, DATA_2, DATA_13];
            const RESULT: MockXmlObject[] =
               XmlObjectBuilder.instantiateMultiple<MockXmlObject>(DATA, MockXmlObject);

            expect(RESULT.length).toBe(DATA.length);
            expect(RESULT[0].data).toBe(DATA[0]);
            expect(RESULT[1].data).toBe(DATA[1]);
            expect(RESULT[2].data).toBe(DATA[2]);
         });
      });
   });
});