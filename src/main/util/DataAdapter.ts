import { AdaptedData } from "../core/AdaptedData";
import { AdaptedDataImpl } from "../core/AdaptedDataImpl";
import { RawData } from "../core/RawData";
import { FormattedString } from "./FormattedString";

export class DataAdapter {
   static adapt(data: RawData): AdaptedData {
      return this.adaptNode(data, "ROOT");
   }

   private static adaptNode(node: RawData, objectLocation: string): AdaptedData {
      let children: {[tagname: string]: AdaptedData[]} = {};
      let attributes: {[key: string]: string} = {};
      let content: string = node._ || "";

      const rawChildren: {[tagname: string]: RawData[]} = node.$$ ? node.$$ : {};

      for (let tagname in rawChildren) {
         children[tagname] = [];
         let childNodes: RawData[] = rawChildren[tagname];

         for (let index in childNodes) {
            children[tagname].push(this.adaptNode(childNodes[index], new FormattedString(
               "{0} > {1}[{2}]", objectLocation, tagname, index).toNative()));
         }
      }

      if (node.$) {
         for (let key in node.$) {
            attributes[key] = node.$[key];
         }
      }

      return new AdaptedDataImpl(content, attributes, children, objectLocation);
   }
}