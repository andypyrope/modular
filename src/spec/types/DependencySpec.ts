import { Dependency } from "./../../main/types/Dependency";

describe("Dependency", (): void => {
   beforeEach((): void => {
   });

   it("initializes properly", (): void => {
      let testObj: Dependency = new Dependency({
         "_": "Meow"
      });

      expect(testObj.getId()).toBe("Meow");
   });

   it("idk", (): void => {
      let testObj: Dependency = new Dependency({
         "_": "Meow"
      });

      spyOn(testObj, "getId").and.returnValue("Roar");

      expect(testObj.getId()).toBe("Roar");
      expect(testObj.getId).toHaveBeenCalledTimes(1);
   });
});