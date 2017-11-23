import { DataAdapter } from "../../main/util/DataAdapter";
import { AdaptedData } from "../../main/core/AdaptedData";

interface SS {
}

// NOTE alalev: This spec assumes that AdaptedData and FormattedString work correctly

// NOTE alalev: This spec cannot check whether the xmlObjectPath of the resulting
// AdaptedData instance is correct because it's private. Changing the visibility of
// fields for testing purposes is an anti-pattern, so it will have to remain untested.
describe("DataAdapter", () => {
   describe("#adapt", () => {
      describe("WHEN called with empty raw data", () => {
         it("THEN it returns an empty AdaptedData instance", function (this: SS): void {
            const result: AdaptedData = DataAdapter.adapt({});
         });
      });

      describe("WHEN called with raw data with some content", () => {
         it("THEN it returns an AdaptedData instance with that content", function (this: SS): void {
            const content: string = "some content";
            const result: AdaptedData = DataAdapter.adapt({ _: content });
            expect(result.getContent()).toBe(content);
         });
      });

      describe("WHEN called with raw data with an attribute", () => {
         it("THEN it returns an AdaptedData instance with that attribute", function (this: SS): void {
            const attributeKey: string = "attributeKey";
            const attributeValue: string = "attributeValue";

            let attributes: { [key: string]: string } = {};
            attributes[attributeKey] = attributeValue;

            const result: AdaptedData = DataAdapter.adapt({ $: attributes });
            expect(result.getAttribute(attributeKey)).toBe(attributeValue);
         });
      });

      describe("WHEN called with raw data with children", () => {
         it("THEN it returns an AdaptedData instance with those children as AdaptedData instances", function (this: SS): void {
            const childType: string = "ChildType";
            const otherChildType: string = "OtherChildType";

            const result: AdaptedData = DataAdapter.adapt({
               _: "obj1",
               $$: {
                  "ChildType": [{
                     _: "obj2"
                  }, {
                     _: "obj3",
                     $$: {
                        "OtherChildType": [{
                           _: "obj4"
                        }]
                     }
                  }]
               }
            });
            /*
            This is the XML equivalent of the objects:
               <Unknown>
                  obj1
                  <ChildType>obj2</ChildType>
                  <ChildType>
                     obj3
                     <OtherChildType>obj4</OtherChildType>
                  </ChildType>
               </Unknown>
            */
            expect(result.getContent()).toBe("obj1");
            let obj1Children: AdaptedData[] = result.getChildren(childType);
            expect(obj1Children.length).toBe(2);
            expect(obj1Children[0].getContent()).toBe("obj2");
            expect(obj1Children[1].getContent()).toBe("obj3");

            let obj3Children: AdaptedData[] =
               obj1Children[1].getChildren(otherChildType);
            expect(obj3Children.length).toBe(1);
            expect(obj3Children[0].getContent()).toBe("obj4");
         });
      });
   });
});