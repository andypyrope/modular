import { Assertion } from "../Assertion";

/**
 * The base abstract class all {@link Assertion} concrete classes should extend.
 *
 * @export
 * @abstract
 * @class AssertionBase
 * @implements {Assertion}
 */
export abstract class AssertionBase implements Assertion {
   protected _isSafe: boolean = false;

   safe(): Assertion {
      this._isSafe = true;
      return this;
   }

   fatal(): Assertion {
      this._isSafe = false;
      return this;
   }

   isSafe(): boolean {
      return this._isSafe;
   }

   abstract test(data: string): boolean;
   abstract message(): string;
}