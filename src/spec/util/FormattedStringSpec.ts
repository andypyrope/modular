import { FormattedString } from "../../main/util/FormattedString";

interface SS {
}

describe("FormattedString", () => {
   describe("#toNative", () => {
      describe("WHEN there are no arguments", () => {
         it("THEN it returns the template", function (this: SS): void {
            const template: string = "The {0} fox jumped {1} the {2} {0} dog";
            const expected: string = template;

            const result: string = new FormattedString(template).toNative();
            expect(result).toBe(expected);
         });
      });

      describe("WHEN there is only one argument", () => {
         it("THEN it replaces only the '{0}' placeholders in the template", function (this: SS): void {
            const template: string = "The {0} fox jumped {1} the {2} {0} dog";
            const expected: string = "The brown fox jumped {1} the {2} brown dog";

            const result: string = new FormattedString(template, "brown").toNative();
            expect(result).toBe(expected);
         });
      });

      describe("WHEN there are two arguments", () => {
         it("THEN it replaces only the '{0}' and '{1}' placeholders in the template", function (this: SS): void {
            const template: string = "The {0} fox jumped {1} the {2} {0} dog";
            const expected: string = "The brown fox jumped over the {2} brown dog";

            const result: string = new FormattedString(template, "brown", "over")
               .toNative();
            expect(result).toBe(expected);
         });
      });

      describe("WHEN there are three arguments and two placeholders", () => {
         it("THEN it ignores the third argument", function (this: SS): void {
            const template: string = "The {0} fox jumped {1} the {0} dog";
            const expected: string = "The brown fox jumped over the brown dog";

            const result: string = new FormattedString(
               template,
               "brown", "over", "somethingElse"
            ).toNative();
            expect(result).toBe(expected);
         });
      });

      describe("WHEN the first argument is '{1}' and the second one is '{0}'", () => {
         it("THEN it applies them appropriately", function (this: SS): void {
            const template: string = "{0} {1} {0} {1}";
            const expected: string = "{1} {0} {1} {0}";

            const result: string = new FormattedString(template, "{1}", "{0}")
               .toNative();
            expect(result).toBe(expected);
         });
      });
   });
});