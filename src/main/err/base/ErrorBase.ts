export abstract class ErrorBase extends Error {
   constructor(message?: string) {
      super(message);
      (this as any).__proto__ = ErrorBase.prototype;
   }

   protected resetPrototype(clazz: any): void {
      (this as any).__proto__ = clazz.prototype;
   }
}