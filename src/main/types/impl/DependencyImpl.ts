import { AdaptedData } from "../../core/AdaptedData";
import { KebabCaseAssertion } from "../../assertions/KebabCaseAssertion";
import { XmlObjectBase } from "./base/XmlObjectBase";
import { Dependency } from "../Dependency";

export class DependencyImpl extends XmlObjectBase implements Dependency {
   readonly id: string;

   constructor(data: AdaptedData) {
      super(data);
      this.id = this.data.getContent([new KebabCaseAssertion()]);
   }
}