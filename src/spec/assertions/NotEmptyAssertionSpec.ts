import { NotEmptyAssertion } from "../../main/assertions/NotEmptyAssertion";

interface SS {
}

describe("NotEmptyAssertion", () => {
   describe("#test", () => {
      describe("WHEN called with an empty string", () => {
         it("THEN it returns false", function (this: SS): void {
            expect(new NotEmptyAssertion().test("")).toBe(false);
         });
      });

      describe("WHEN called with a non-empty string", () => {
         it("THEN it returns true", function (this: SS): void {
            expect(new NotEmptyAssertion().test("Asasgd asdgdAsd")).toBe(true);
         });
      });
   });

   describe("#message", () => {
      it("returns the correct value", function (this: SS): void {
         expect(new NotEmptyAssertion().message()).toBe("Value is not an empty string");
      });
   });
});