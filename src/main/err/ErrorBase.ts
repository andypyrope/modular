export abstract class ErrorBase extends Error {
   constructor(message?: string) {
      super(message);
      this.resetPrototype(ErrorBase);
   }

   protected resetPrototype(clazz: any): void {
      let self: any = this;
      self.__proto__ = clazz.prototype;
   }
}