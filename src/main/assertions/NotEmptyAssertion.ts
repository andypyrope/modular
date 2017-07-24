import { AssertionBase } from "./base/AssertionBase";

/**
 * Valid strings are all which evaluate to true (all non-empty strings).
 *
 * @export
 * @class NotEmptyAssertion
 * @extends {AssertionBase}
 */
export class NotEmptyAssertion extends AssertionBase {
   test(data: string): boolean {
      return !!data;
   }

   message(): string {
      return "Value is not an empty string";
   }
}