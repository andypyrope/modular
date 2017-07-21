/**
 * A wrapper around the native primitive 'string'. Just like 'Integer' is a wrapper of
 * 'int' in Java.
 *
 * @export
 * @interface String
 */
export interface String {
   /**
    * Returns the 'string' equivalent of the instance.
    *
    * It was supposed to be called 'toString', but this idea was discarded when some
    * difficulties came into play.
    *
    * @returns {string}
    * @memberof String
    */
   toNative(): string;
}