import { String } from "./../core/String";

export class FormattedString implements String {
   private args: string[];

   constructor(private template: string, ...args: string[]) {
      this.setArgs(args);
   }

   public toNative(): string {
      return this.args ? this.format() : this.template;
   }

   private setArgs(args: string[]): void {
      this.args = (args && args.length) ? args : undefined;
   }

   private format(): string {
      return this.template.replace(/{(\d+)}/g,
         (match: string, index: number): string => {
            return this.args[index] ? this.args[index] : match;
         }
      );
   }
}