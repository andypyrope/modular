/**
 * An assertion that is to be made upon a string.
 *
 * @export
 * @interface Assertion
 */
export interface Assertion {
   /**
    * Render the assertion fatal, which makes it throw an error when being run.
    *
    * @returns {Assertion}
    * @memberof Assertion
    */
   fatal(): Assertion;

   /**
    * Render the assertion safe, which makes it NOT throw an error when being run.
    *
    * @returns {Assertion}
    * @memberof Assertion
    */
   safe(): Assertion;

   /**
    * Whether the data complies with the given assertion.
    *
    * @param {string} data
    * @returns {boolean}
    * @memberof Assertion
    */
   test(data: string): boolean;

   /**
    * Whether the assertion has been marked as safe. If it has not been marked as safe or
    * fatal, it is assumed to be fatal.
    *
    * @returns {boolean}
    * @memberof Assertion
    */
   isSafe(): boolean;

   /**
    * A brief message describing the assertion that can be used in error messages.
    *
    * @returns {string}
    * @memberof Assertion
    */
   message(): string;
}