import { KebabCaseAssertion } from "./../../main/assertions/KebabCaseAssertion";

describe("KebabCaseAssertion", () => {
   describe("#test", () => {
      describe("WHEN called with an empty string", () => {
         it("THEN it returns false", function (): void {
            expect(new KebabCaseAssertion().test("")).toBe(false);
         });
      });

      describe("WHEN called with a CamelCase string", () => {
         it("THEN it returns false", function (): void {
            expect(new KebabCaseAssertion().test("AsdAsd")).toBe(false);
         });
      });

      describe("WHEN called with a kebab-case string", () => {
         it("THEN it returns true", function (): void {
            expect(new KebabCaseAssertion().test("asd-asd")).toBe(true);
         });
      });

      describe("WHEN called with a kebab-case string with numbers at the end", () => {
         it("THEN it returns true", function (): void {
            expect(new KebabCaseAssertion().test("asd-asd123")).toBe(true);
         });
      });

      describe("WHEN called with a kebab-case string with a digit in the middle", () => {
         it("THEN it returns false", function (): void {
            expect(new KebabCaseAssertion().test("asd2-asd")).toBe(false);
         });
      });
   });

   describe("#message", () => {
      it("returns the correct value", function (): void {
         expect(new KebabCaseAssertion().message())
            .toBe("Value is in kebab-case (e.g. 'one-two-three' or 'my-value123')");
      });
   });
});