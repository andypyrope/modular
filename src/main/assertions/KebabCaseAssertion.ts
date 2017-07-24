import { AssertionBase } from "./base/AssertionBase";

/**
 * Valid strings (examples):
 *    foo
 *    foo-1-2
 *    a-b-c
 *    foo-1-bar-2
 * Invalid strings:
 *    1-foo-3
 *    foo-
 *    foo1
 *
 * @export
 * @class KebabCaseAssertion
 * @extends {AssertionBase}
 */
export class KebabCaseAssertion extends AssertionBase {
   private static REGEXP: RegExp = new RegExp("^[a-z]+(-([a-z]+|[0-9]+))*$");

   test(data: string): boolean {
      return KebabCaseAssertion.REGEXP.test(data);
   }

   message(): string {
      return "Value is in kebab-case (e.g. 'one-two-three' or 'my-value-1-a-23') " +
         "RegExp: \"" + KebabCaseAssertion.REGEXP + "\"";
   }
}