
import { AdaptedDataImpl } from "../../main/core/AdaptedDataImpl";
import { AdaptedData } from "../../main/core/AdaptedData";

export class AdaptedDataImplUtil {
   static readonly DEFAULT_CHILD_TYPE: string = "ChildType";
   static readonly DEFAULT_ATTRIBUTE_KEY: string = "attribute-key";

   static withDefaultChildren(...defaultChildren: AdaptedData[]): AdaptedData {
      let children: { [type: string]: AdaptedData[] } = {};
      children[AdaptedDataImplUtil.DEFAULT_CHILD_TYPE] = defaultChildren;
      return new AdaptedDataImpl("", {}, children, "");
   }

   static empty(): AdaptedData {
      return new AdaptedDataImpl("", {}, {}, "");
   }

   static withContent(content: string): AdaptedData {
      return new AdaptedDataImpl(content, {}, {}, "");
   }

   static withDefaultAttribute(attribute: string): AdaptedData {
      let attributes: { [type: string]: string } = {};
      attributes[AdaptedDataImplUtil.DEFAULT_ATTRIBUTE_KEY] = attribute;
      return new AdaptedDataImpl("", attributes, {}, "");
   }
}