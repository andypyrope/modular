import { AdaptedData } from "./../../main/core/AdaptedData";
import { AdaptedDataImpl } from "./../../main/core/AdaptedDataImpl";

export class AdaptedDataFactory {
   private dataContent: string = "";
   private dataAttributes: { [key: string]: string } = {};
   private dataChildren: { [tagname: string]: AdaptedData[] } = {};

   constructor(otherFactory?: AdaptedDataFactory) {
      if (otherFactory) {
         this.setToOtherFactory(otherFactory);
      }
   }

   private setToOtherFactory(other: AdaptedDataFactory): void {
      this.dataContent = other.dataContent;

      for (let key in other.dataAttributes) {
         this.dataAttributes[key] = other.dataAttributes[key];
      }

      for (let tagname in other.dataChildren) {
         this.dataChildren[tagname] = other.dataChildren[tagname].slice();
      }
   }

   public text(value: string): AdaptedDataFactory {
      this.dataContent = value;
      return this;
   }

   public attr(key: string, value: string): AdaptedDataFactory {
      this.dataAttributes[key] = value;
      return this;
   }

   public child(tagname: string, child: AdaptedData): AdaptedDataFactory {
      this.dataChildren[tagname] = this.dataChildren[tagname] || [];
      this.dataChildren[tagname].push(child);
      return this;
   }

   public children(tagname: string, children: AdaptedData[]): AdaptedDataFactory {
      this.dataChildren[tagname] = (this.dataChildren[tagname] || []).concat(children);
      return this;
   }

   public build(): AdaptedData {
      return new AdaptedDataImpl(
         this.dataContent, this.dataAttributes, this.dataChildren, "ROOT");
   }
}