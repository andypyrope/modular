import { AssertionBase } from "./base/AssertionBase";

export class KebabCaseAssertion extends AssertionBase {
   test(data: string): boolean {
      return /^[a-z]+(-[a-z]+)*[0-9]*$/.test(data);
   }

   message(): string {
      return "Value is in kebab-case (e.g. 'one-two-three' or 'my-value123')";
   }
}