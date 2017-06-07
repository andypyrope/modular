/**
 * An XML element/object, possibly with its own content/children/attributes.
 *
 * @export
 * @interface XmlObject
 */
export interface XmlObject {
   /**
    * @returns {string} A string representing the XML object as accurately as possible
    *
    * @memberOf XmlObject
    */
   identification(): string;

   /**
    * Updates the parent of the object
    *
    * @param {XmlObject} parent The new parent
    *
    * @memberOf XmlObjectBase
    */
   setParent(parent: XmlObject): void;
}