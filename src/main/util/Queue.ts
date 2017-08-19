import { AlreadyEmptyError } from "./../err/AlreadyEmptyError";

export class Queue<T> {
   private container: T[] = [];
   private firstIndex: number = 0;

   public pop(): T {
      if (this.empty()) {
         throw new AlreadyEmptyError();
      }

      const RESULT: T = this.container[this.firstIndex];
      this.container[this.firstIndex] = null;

      ++this.firstIndex;
      if (this.firstIndex * 2 >= this.container.length) {
         this.container = this.container.slice(this.firstIndex);
         this.firstIndex = 0;
      }

      return RESULT;
   }

   public push(element: T): void {
      this.container.push(element);
   }

   public empty(): boolean {
      return this.container.length === 0;
   }

   public size(): number {
      return this.container.length - this.firstIndex;
   }
}