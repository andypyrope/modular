import { ExpectedSingleChildError } from "./../err/ExpectedSingleChildError";
import { AttributeNotFoundError } from "./../err/AttributeNotFoundError";
import { RawData } from "./RawData";
import { Assertion } from "./../assertions/Assertion";

/**
 * Represents an XML object. It has content, attributes and children along with methods
 * to access them.
 *
 * @export
 * @interface AdaptedData
 */
export interface AdaptedData {
   /**
    * Gets exactly 1 child of type 'tagname'. If there are 0 or more than one child,
    * an ExpectedSingleChildError error is thrown.
    *
    * @param {string} tagname
    * @returns {AdaptedData[]} The child
    * @memberof AdaptedData
    */
   getSingleChild(tagname: string): AdaptedData;

   /**
    * Gets all children of type 'tagname'.
    *
    * @param {string} tagname
    * @returns {AdaptedData[]} The children
    * @memberof AdaptedData
    */
   getChildren(tagname: string): AdaptedData[];

   /**
    * Get the content of the XML object.
    *
    * @param {Assertion[]} [assertions=empty array] Assertions to apply to the content.
    *
    * @returns {string} The content
    * @memberof AdaptedData
    */
   getContent(assertions?: Assertion[]): string;

   /**
    * Get an attribute of the XML object. If the attribute does not exist, an
    * {@link AttributeNotFoundError} is thrown.
    *
    * @param {string} key The key of the attribute.
    * @param {Assertion][]} [assertions=empty array] Whether the attribute is mandatory.
    *    If set to <code>true</code> and there is no such attribute,
    *       an AttributeNotFoundError is thrown.
    *    If set to <code>false</code> and there is no such attribute,
    *       <code>null</code> is returned.
    * @returns {string} The attribute
    * @memberof AdaptedData
    */
   getAttribute(key: string, assertions?: Assertion[]): string;
}