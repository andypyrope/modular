/**
 * Raw data as returned by 'xml2js' when parsing XML. Represents an XML object.
 *
 * @export
 * @interface RawData
 */
export interface RawData {
   /**
    * Content
    *
    * @type {string}@memberof RawData
    */
   _?: string;

   /**
    * Attributes
    *
    * @type {{[key: string]: string}}@memberof RawData
    */
   $?: {[key: string]: string};

   /**
    * Children
    *
    * @type {{[tagname: string]: RawData}}@memberof RawData
    */
   $$?: {[tagname: string]: RawData[]};
}