import { AlreadyEmptyError } from "../err/AlreadyEmptyError";

export class Queue<T> {
   private container: (T | undefined)[] = [];
   private firstIndex: number = 0;

   pop(): T {
      if (this.empty()) {
         throw new AlreadyEmptyError();
      }

      const result: T | undefined = this.container[this.firstIndex];
      if (result === undefined) {
         throw new Error("Popping an undefined value is forbidden");
      }

      this.container[this.firstIndex] = undefined;

      ++this.firstIndex;
      if (this.firstIndex * 2 >= this.container.length) {
         this.container = this.container.slice(this.firstIndex);
         this.firstIndex = 0;
      }

      return result;
   }

   push(element: T): void {
      if (element === undefined) {
         throw new Error("Pushing an undefined value is forbidden");
      }
      this.container.push(element);
   }

   empty(): boolean {
      return this.container.length === 0;
   }

   size(): number {
      return this.container.length - this.firstIndex;
   }
}