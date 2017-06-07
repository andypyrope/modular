import { TestObj } from "./main-src/TestObj";
import { TestUtil } from "./main-src/TestUtil";

describe("TestObj", () => {
   beforeEach(function() {
      this.someValue = "asd";
   });

   describe("when the utility class is not spied upon", () => {
      it("helps me experiment", function () {
         console.log("someValue is... " + this.someValue);

         let testObj: TestObj = new TestObj();

         let getStringSpy: jasmine.Spy = spyOn(TestUtil, "getString");
         getStringSpy.and.callThrough();
         expect(testObj.getString()).toBe("not-mocked");
         expect(getStringSpy).toHaveBeenCalledTimes(1);

         getStringSpy.and.returnValue("mocked");
         expect(testObj.getString()).toBe("mocked");
      });
   });
});