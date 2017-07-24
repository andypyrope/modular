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
            expect(new KebabCaseAssertion().test("FooBar")).toBe(false);
         });
      });

      describe("WHEN called with a kebab-case string", () => {
         it("THEN it returns true", function (): void {
            expect(new KebabCaseAssertion().test("foo")).toBe(true);
            expect(new KebabCaseAssertion().test("foo-bar")).toBe(true);
            expect(new KebabCaseAssertion().test("foo-bar-foo")).toBe(true);
            expect(new KebabCaseAssertion().test("foo-bar-123")).toBe(true);
            expect(new KebabCaseAssertion().test("foo-bar-1-a-2-3-foo")).toBe(true);
         });
      });

      describe("WHEN called with a string where numbers are not separated from letters", () => {
         it("THEN it returns false", function (): void {
            expect(new KebabCaseAssertion().test("foo-bar123")).toBe(false);
            expect(new KebabCaseAssertion().test("foo1-bar")).toBe(false);
         });
      });

      describe("WHEN called with a string with a number at the start", () => {
         it("THEN it returns false", function (): void {
            expect(new KebabCaseAssertion().test("1-foo")).toBe(false);
         });
      });

      describe("WHEN called with a string with a leading hyphen", () => {
         it("THEN it returns false", function (): void {
            expect(new KebabCaseAssertion().test("-foo")).toBe(false);
         });
      });

      describe("WHEN called with a string with a trailing hyphen", () => {
         it("THEN it returns false", function (): void {
            expect(new KebabCaseAssertion().test("foo-")).toBe(false);
         });
      });
   });

   describe("#message", () => {
      it("returns the correct value", function (): void {
         expect(new KebabCaseAssertion().message()).toContain(
            "Value is in kebab-case (e.g. 'one-two-three' or 'my-value-1-a-23') " +
            "RegExp: "
         );
      });
   });
});