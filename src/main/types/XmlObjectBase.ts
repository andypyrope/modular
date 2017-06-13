import { XmlObject } from "./../XmlObject";
import { Validator } from "validator.ts/Validator";
import { RawParsed } from "./../RawParsed";
import { ExpectedSingleChildError } from "./../err/ExpectedSingleChildError";
import { AttributeNotFoundError } from "./../err/AttributeNotFoundError";
import { NoTextContentError } from "./../err/NoTextContentError";
import { FormattedString } from "./../util/FormattedString";
import { XmlObjectBuilder } from "./../util/XmlObjectBuilder";

export abstract class XmlObjectBase implements XmlObject {
   private static readonly CONTENT_KEY: string = "_";
   private textContent?: string;

   private static readonly ATTRIBUTES_KEY: string = "$";
   private attributes: { [attribute: string]: string };

   private static readonly CHILDREN_KEY: string = "$$";
   private children: { [tagName: string]: any[] };
   private instantiatedChildren: { [tagName: string]: any[] };

   private hasUnusedTextContent: boolean;
   private unusedChildTypes: { [tagName: string]: true };
   private unusedAttributes: { [attribute: string]: true };

   private static readonly MAX_TEXT_CONTENT_IDENTIFICATION_LENGTH: number = 20;

   constructor(rawData: any, private parent?: XmlObject) {
      if (typeof rawData === "string") {
         this.textContent = rawData.trim();
         this.attributes = {};
         this.children = {};
      } else {
         this.textContent = rawData[XmlObjectBase.CONTENT_KEY];
         this.attributes = rawData[XmlObjectBase.ATTRIBUTES_KEY] || {};
         this.children = rawData[XmlObjectBase.CHILDREN_KEY] || {};
      }

      this.hasUnusedTextContent = !!this.textContent;

      this.unusedAttributes = {};
      for (let attributeKey in this.attributes) {
         this.unusedAttributes[attributeKey] = true;
      }

      this.unusedChildTypes = {};
      for (let childType in this.children) {
         this.unusedChildTypes[childType] = true;
      }

      this.instantiatedChildren = {};

      this.initialize();
   }

   public setParent(parent: XmlObject): void {
      this.parent = parent;
   }

   protected getTextContent(): string {
      if (!this.textContent) {
         throw new NoTextContentError(this);
      }

      this.hasUnusedTextContent = false;
      return this.textContent;
   }

   protected getChild<T extends XmlObject>(type: any): T {
      let typeName: string = type.name;
      let childrenOfTag: RawParsed[] = this.children[typeName];
      if (!childrenOfTag || childrenOfTag.length !== 1) {
         throw new ExpectedSingleChildError(typeName, childrenOfTag.length, this);
      }

      if (this.instantiatedChildren[typeName]) {
         return this.instantiatedChildren[typeName][0];
      }

      let child: T = XmlObjectBuilder.instantiate<T>(childrenOfTag[0], type, this);
      delete this.unusedChildTypes[typeName];
      return child;
   }

   protected getChildren<T extends XmlObject>(type: any): T[] {
      let typeName: string = type.name;
      let childrenOfTag: any[] = this.children[typeName];
      if (!childrenOfTag) {
         return [];
      }

      if (this.instantiatedChildren[typeName]) {
         return this.instantiatedChildren[typeName];
      }

      let children: T[] = [];
      for (let childOfTag of childrenOfTag) {
         children.push( XmlObjectBuilder.instantiate<T>(childOfTag, type, this));
      }

      delete this.unusedChildTypes[typeName];
      return children;
   }

   protected getAttribute(attribute: string): string {
      if (!this.attributes[attribute]) {
         throw new AttributeNotFoundError(attribute, this);
      }

      delete this.unusedAttributes[attribute];

      return this.attributes[attribute];
   }

   public identification(): string {
      let characteristics: string[] = [];

      if (this.attributes["id"]) {
         characteristics.push("id: '" + this.attributes["id"] + "'");
      }
      if (this.attributes["name"]) {
         characteristics.push("name: '" + this.attributes["name"] + "'");
      }
      if (this.textContent) {
         let content: string = this.textContent;
         if (content.length > XmlObjectBase.MAX_TEXT_CONTENT_IDENTIFICATION_LENGTH) {
            content = content.substr(0,
               XmlObjectBase.MAX_TEXT_CONTENT_IDENTIFICATION_LENGTH - 3) + "...";
         }
         characteristics.push("content: '" + content.replace(/\n/g, "\\n") + "'");
      }

      let result: string = new FormattedString("{0}({1})",
         this.className(),
         (characteristics.length === 0) ? "-" : characteristics.join(", ")
      ).toNative();

      if (this.parent) {
         result = this.parent.identification() + " > " + result;
      }

      return result;
   }

   public examineUnused(recursive: boolean = false): void {
      if (this.hasUnusedTextContent) {
         console.warn(new FormattedString("XML object '{0}' has unused text content",
            this.identification()).toNative());
      }
      for (let attributeKey in this.unusedAttributes) {
         if (attributeKey !== "name" && attributeKey !== "id") {
            console.warn(new FormattedString(
               "XML object '{0}' has unused attribute: '{1}'",
               this.identification(), attributeKey).toNative());
         }
      }
      for (let childTag in this.unusedChildTypes) {
         console.warn(new FormattedString(
            "The child tags of type '{0}' are not used in XML object '{1}'",
            childTag, this.identification()).toNative());
      }

      if (recursive) {
         for (let childTag in this.instantiatedChildren) {
            for (let child of this.instantiatedChildren[childTag]) {
               if (child instanceof XmlObjectBase) {
                  child.examineUnused(true);
               }
            }
         }
      }
   }

   private className(): string {
      let anyThis: any = this;
      return anyThis.constructor.name;
   }

   protected abstract initialize(): void;
}