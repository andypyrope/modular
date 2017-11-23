import { MockUtil } from "../mock/MockUtil";
import { Dependency } from "../../main/types/Dependency";
import { AdaptedDataFactory } from "../mock/AdaptedDataFactory";
import { DependencyImpl } from "../../main/types/impl/DependencyImpl";

interface SS {
   id: string;
   build(): Dependency;
}

describe("Dependency", () => {
   beforeEach(function (this: SS): void {
      MockUtil.initialize();
      this.id = "some-dependency-id";

      this.build = (): Dependency => {
         return new DependencyImpl(new AdaptedDataFactory()
            .text(this.id)
            .build());
      };
   });

   describe("WHEN it is initialized with a valid ID", () => {
      it("THEN everything goes well", function (this: SS): void {
         let testObj: Dependency = this.build();
         expect(testObj.id).toBe(this.id);
      });
   });

   describe("WHEN its ID is not in kebab-case", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.id = "libModuleName";
         expect(this.build).toThrow();
      });
   });

   describe("WHEN its ID is empty", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.id = "";
         expect(this.build).toThrow();
      });
   });
});