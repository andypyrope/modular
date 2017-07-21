import { FormattedString } from "./../../main/util/FormattedString";

describe("FormattedString", () => {
   describe("#toNative", () => {
      describe("WHEN there are no arguments", () => {
         it("THEN it returns the template", function (): void {
            const TEMPLATE: string = "The {0} fox jumped {1} the {2} {0} dog";
            const EXPECTED: string = TEMPLATE;

            const RESULT: string = new FormattedString(TEMPLATE).toNative();
            expect(RESULT).toBe(EXPECTED);
         });
      });

      describe("WHEN there is only one argument", () => {
         it("THEN it replaces only the '{0}' placeholders in the template", function (): void {
            const TEMPLATE: string = "The {0} fox jumped {1} the {2} {0} dog";
            const EXPECTED: string = "The brown fox jumped {1} the {2} brown dog";

            const RESULT: string = new FormattedString(TEMPLATE, "brown").toNative();
            expect(RESULT).toBe(EXPECTED);
         });
      });

      describe("WHEN there are two arguments", () => {
         it("THEN it replaces only the '{0}' and '{1}' placeholders in the template", function (): void {
            const TEMPLATE: string = "The {0} fox jumped {1} the {2} {0} dog";
            const EXPECTED: string = "The brown fox jumped over the {2} brown dog";

            const RESULT: string = new FormattedString(TEMPLATE, "brown", "over")
               .toNative();
            expect(RESULT).toBe(EXPECTED);
         });
      });

      describe("WHEN there are three arguments and two placeholders", () => {
         it("THEN it ignores the third argument", function (): void {
            const TEMPLATE: string = "The {0} fox jumped {1} the {0} dog";
            const EXPECTED: string = "The brown fox jumped over the brown dog";

            const RESULT: string = new FormattedString(
               TEMPLATE,
               "brown", "over", "somethingElse"
            ).toNative();
            expect(RESULT).toBe(EXPECTED);
         });
      });

      describe("WHEN the first argument is '{1}' and the second one is '{0}'", () => {
         it("THEN it applies them appropriately", function (): void {
            const TEMPLATE: string = "{0} {1} {0} {1}";
            const EXPECTED: string = "{1} {0} {1} {0}";

            const RESULT: string = new FormattedString(TEMPLATE, "{1}", "{0}")
               .toNative();
            expect(RESULT).toBe(EXPECTED);
         });
      });
   });
});