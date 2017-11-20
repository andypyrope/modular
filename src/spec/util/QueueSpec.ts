import { Queue } from "../../main/util/Queue";

describe("Queue", (): void => {
   describe("#pop", () => {
      describe("WHEN many elements are popped out", () => {
         it("THEN it returns them in the correct order", function (): void {
            const testObj: Queue<string> = new Queue();

            testObj.push("first");
            testObj.push("second");
            expect(testObj.pop()).toBe("first");
            expect(testObj.pop()).toBe("second");
         });
      });

      describe("WHEN the queue is empty", () => {
         it("THEN it throws an error", function (): void {
            expect(() => { new Queue<string>().pop(); }).toThrowError(
               "The container is already empty. " +
               "You cannot extract any elements from it.");
         });
      });
   });

   describe("#empty", () => {
      describe("WHEN the queue is empty", () => {
         it("THEN it returns true", function (): void {
            expect(new Queue<string>().empty()).toBe(true);
         });
      });

      describe("WHEN the queue is not empty", () => {
         it("THEN it returns false", function (): void {
            const testObj: Queue<string> = new Queue();
            testObj.push("asd");
            expect(testObj.empty()).toBe(false);
         });
      });
   });

   describe("#push", () => {
      describe("WHEN undefined is pushed", () => {
         it("THEN it throws an error", function (): void {
            const testObj: Queue<string | undefined> = new Queue();
            expect((): void => testObj.push(undefined))
               .toThrowError("Pushing an undefined value is forbidden");
         });
      });

      describe("WHEN false is pushed", () => {
         it("THEN it does not throw an error", function (): void {
            const testObj: Queue<boolean> = new Queue();
            expect((): void => testObj.push(false)).not.toThrow();
         });
      });
   });

   describe("#size", () => {
      it("returns the correct number of elements", function (): void {
         const testObj: Queue<string> = new Queue();

         testObj.push("first");
         expect(testObj.size()).toBe(1);
         testObj.push("second");
         expect(testObj.size()).toBe(2);
      });
   });
});