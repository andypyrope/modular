import { AssertionBase } from "./../../main/assertions/base/AssertionBase";

export class MockAssertion extends AssertionBase {
   constructor() {
      super();
      this._isSafe = true;
   }

   test(data: string): boolean {
      return true;
   }

   message(): string {
      return "Mock assertion";
   }
}