import { MockUtil } from "../mock/MockUtil";
import { Dependency } from "../../main/types/Dependency";
import { AdaptedDataFactory } from "../mock/AdaptedDataFactory";
import { DependencyImpl } from "../../main/types/impl/DependencyImpl";

interface SS {
   id: string;
   build(): Dependency;
}

describe("Dependency", () => {
   beforeEach(function (): void {
      MockUtil.initialize();
      (this as SS).id = "some-dependency-id";

      (this as SS).build = (): Dependency => {
         return new DependencyImpl(new AdaptedDataFactory()
            .text((this as SS).id)
            .build());
      };
   });

   describe("WHEN it is initialized with a valid ID", () => {
      it("THEN everything goes well", function (): void {
         let testObj: Dependency = (this as SS).build();
         expect(testObj.id).toBe((this as SS).id);
      });
   });

   describe("WHEN its ID is not in kebab-case", () => {
      it("THEN it throws an error", function (): void {
         (this as SS).id = "libModuleName";
         expect((this as SS).build).toThrow();
      });
   });

   describe("WHEN its ID is empty", () => {
      it("THEN it throws an error", function (): void {
         (this as SS).id = "";
         expect((this as SS).build).toThrow();
      });
   });
});