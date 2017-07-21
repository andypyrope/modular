import { AssertionBase } from "./base/AssertionBase";

export class NotEmptyAssertion extends AssertionBase {
   test(data: string): boolean {
      return !!data;
   }

   message(): string {
      return "Value is not an empty string";
   }
}