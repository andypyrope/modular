import { String } from "../core/String";

export class FormattedString implements String {
   private readonly args: string[];

   constructor(private readonly template: string, ...args: string[]) {
      this.args = args;
   }

   toNative(): string {
      return this.args ? this.format() : this.template;
   }

   private format(): string {
      return this.template.replace(/{(\d+)}/g,
         (match: string, index: number): string => {
            return this.args[index] ? this.args[index] : match;
         }
      );
   }
}