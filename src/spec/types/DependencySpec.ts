import { MockUtil } from "./../mock/MockUtil";
import { Dependency } from "./../../main/types/Dependency";
import { AdaptedDataFactory } from "./../mock/AdaptedDataFactory";

describe("Dependency", () => {
   beforeEach(function (): void {
      MockUtil.initialize();
      this.id = "some-dependency-id";

      this.build = (): Dependency => {
         return new Dependency(new AdaptedDataFactory()
            .text(this.id)
            .build());
      };
   });

   describe("WHEN it is initialized with a valid ID", () => {
      it("THEN everything goes well", function (): void {
         let testObj: Dependency = this.build();
         expect(testObj.id).toBe(this.id);
      });
   });

   describe("WHEN it is initialized with null or undefined", () => {
      it("THEN everything goes well", function (): void {
         expect(() => { new Dependency(null); }).not.toThrow();
         expect(() => { new Dependency(undefined); }).not.toThrow();
      });
   });

   describe("WHEN its ID is not in kebab-case", () => {
      it("THEN it throws an error", function (): void {
         this.id = "libModuleName";
         expect(this.build).toThrow();
      });
   });

   describe("WHEN its ID is empty", () => {
      it("THEN it throws an error", function (): void {
         this.id = "";
         expect(this.build).toThrow();
      });
   });
});