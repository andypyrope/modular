import { ExpectedSingleChildError } from "./../err/ExpectedSingleChildError";
import { AttributeNotFoundError } from "./../err/AttributeNotFoundError";
import { AttributeAssertionError } from "./../err/AttributeAssertionError";
import { ContentAssertionError } from "./../err/ContentAssertionError";
import { RawData } from "./RawData";
import { AdaptedData } from "./AdaptedData";
import { Assertion } from "./../assertions/Assertion";

/**
 * The implementation of {@link AdaptedData}
 *
 * @export
 * @class AdaptedDataImpl
 * @implements {AdaptedData}
 */
export class AdaptedDataImpl implements AdaptedData {
   constructor(
      private content: string,
      private attributes: { [key: string]: string },
      private children: { [tagname: string]: AdaptedData[] },
      private xmlObjectLocation: string) {
   }

   public getSingleChild(tagname: string): AdaptedData {
      let foundChildren: AdaptedData[] = this.children[tagname] || [];
      if (foundChildren.length !== 1) {
         throw new ExpectedSingleChildError(tagname, foundChildren.length,
            this.xmlObjectLocation);
      }

      return foundChildren[0];
   }

   public getChildren(tagname: string): AdaptedData[] {
      let children: AdaptedData[] = this.children[tagname];
      return children ? children.slice() : [];
   }

   public getContent(assertions: Assertion[] = []): string {
      let content: string = this.content;
      if (!content) {
         content = "";
      }

      for (let assertion of assertions) {
         if (!assertion.test(content)) {
            if (assertion.isSafe()) {
               // NOTE alalev: I'm sure there is a better way to do this
               console.warn(new ContentAssertionError(
                  content, assertion, this.xmlObjectLocation).message);
            } else {
               throw new ContentAssertionError(
                  content, assertion, this.xmlObjectLocation);
            }
         }
      }

      return content;
   }

   public getAttribute(key: string, assertions: Assertion[] = []): string {
      let attribute: string = this.attributes[key];

      if (attribute === undefined) {
         throw new AttributeNotFoundError(key, this.xmlObjectLocation);
      }

      for (let assertion of assertions) {
         if (!assertion.test(attribute)) {
            if (assertion.isSafe()) {
               // NOTE alalev: I'm sure there is a better way to do this
               console.warn(new AttributeAssertionError(
                  key, assertion, this.xmlObjectLocation).message);
            } else {
               throw new AttributeAssertionError(key, assertion, this.xmlObjectLocation);
            }
         }
      }

      return attribute;
   }
}