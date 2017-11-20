import { AdaptedData } from "../../main/core/AdaptedData";
import { AdaptedDataImplUtil } from "../mock/AdaptedDataImplUtil";
import { MockAssertion } from "../mock/MockAssertion";
import { Assertion } from "../../main/assertions/Assertion";

interface SS {
   testSpy: jasmine.Spy;
   isSafeSpy: jasmine.Spy;
   assertion: Assertion;
   content: string;
   testObject: AdaptedData;
   attribute: string;
   key: string;
}

describe("AdaptedDataImpl", () => {
   beforeEach(function (): void {
      const assertion: Assertion = new MockAssertion();
      (this as SS).testSpy = spyOn(assertion, "test").and.callThrough();
      (this as SS).isSafeSpy = spyOn(assertion, "isSafe").and.callThrough();
      (this as SS).assertion = assertion;
   });

   describe("WHEN it is instantiated with empty values", () => {
      it("THEN it does not throw any errors", function (): void {
         expect(AdaptedDataImplUtil.empty).not.toThrow();
      });
   });

   describe("#getSingleChild", () => {
      describe("WHEN the object has a single child of that type", () => {
         it("THEN it returns the child", function (): void {
            const child: AdaptedData = AdaptedDataImplUtil.empty();
            const testObject: AdaptedData =
               AdaptedDataImplUtil.withDefaultChildren(child);

            expect(() => {
               testObject.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            expect(testObject.getSingleChild(
               AdaptedDataImplUtil.DEFAULT_CHILD_TYPE)).toBe(child);
         });
      });

      describe("WHEN the object has no children of that type", () => {
         it("THEN it throws an error", function (): void {
            const testObject: AdaptedData = AdaptedDataImplUtil.empty();

            expect(() => {
               testObject.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).toThrow();
         });
      });

      describe("WHEN the object has more than one child of that type", () => {
         it("THEN it throws an error", function (): void {
            const testObject: AdaptedData = AdaptedDataImplUtil.withDefaultChildren(
               AdaptedDataImplUtil.empty(), AdaptedDataImplUtil.empty());

            expect(() => {
               testObject.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).toThrow();
         });
      });
   });

   describe("#getChildren", () => {
      describe("WHEN the object has a single child of that type", () => {
         it("THEN it returns an array containing the child", function (): void {
            const child: AdaptedData = AdaptedDataImplUtil.empty();
            const testObject: AdaptedData =
               AdaptedDataImplUtil.withDefaultChildren(child);

            expect(() => {
               testObject.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            const result: AdaptedData[] =
               testObject.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            expect(result.length).toBe(1);
            expect(result[0]).toBe(child);
         });
      });

      describe("WHEN the object has no children of that type", () => {
         it("THEN it returns an empty array", function (): void {
            const testObject: AdaptedData = AdaptedDataImplUtil.empty();

            expect(() => {
               testObject.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            const result: AdaptedData[] =
               testObject.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            expect(result.length).toBe(0);
         });
      });

      describe("WHEN the object has more than one child of that type", () => {
         it("THEN it returns an array containing the children", function (): void {
            const child1: AdaptedData = AdaptedDataImplUtil.empty();
            const child2: AdaptedData = AdaptedDataImplUtil.empty();
            const testObject: AdaptedData =
               AdaptedDataImplUtil.withDefaultChildren(child1, child2);

            expect(() => {
               testObject.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            const result: AdaptedData[] =
               testObject.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            expect(result.length).toBe(2);
            expect(result[0]).toBe(child1);
            expect(result[1]).toBe(child2);
         });
      });
   });

   describe("#getContent", () => {
      beforeEach(function (): void {
         const content: string = "asd";
         (this as SS).content = content;

         const TEST_OBJECT: AdaptedData = AdaptedDataImplUtil.withContent(content);
         (this as SS).testObject = AdaptedDataImplUtil.withContent(content);
      });

      it("returns the same content the data was instantiated with", function (): void {
         expect((this as SS).testObject.getContent()).toBe((this as SS).content);
      });

      describe("WHEN it is called with an assertion", () => {
         it("THEN it calls the 'test' method of the assertion with the content as an argument", function (): void {
            (this as SS).testObject.getContent([(this as SS).assertion]);
            expect((this as SS).testSpy).toHaveBeenCalledTimes(1);
            expect((this as SS).testSpy.calls.argsFor(0))
               .toEqual([(this as SS).content]);
         });

         describe("WHEN the assertion succeeds", () => {
            it("THEN it returns the content", function (): void {
               (this as SS).testSpy.and.returnValue(true);
               expect((this as SS).testObject.getContent()).toBe((this as SS).content);
            });
         });

         describe("WHEN the assertion fails", () => {
            beforeEach(function (): void {
               (this as SS).testSpy.and.returnValue(false);
               spyOn(console, "warn").and.callFake((): void => { });
            });

            it("THEN it calls the 'isSafe' method of the assertion", function (): void {
               (this as SS).testObject.getContent([(this as SS).assertion]);
               expect((this as SS).isSafeSpy).toHaveBeenCalledTimes(1);
            });

            describe("WHEN the assertion is safe", () => {
               it("THEN it does not throw an error and returns the content but prints a warning", function (): void {
                  (this as SS).isSafeSpy.and.returnValue(true);
                  expect(console.warn).not.toHaveBeenCalled();
                  expect(() => {
                     (this as SS).testObject.getContent([(this as SS).assertion]);
                  }).not.toThrow();
                  expect(console.warn).toHaveBeenCalledTimes(1);
               });
            });

            describe("WHEN the assertion is not safe", () => {
               it("THEN it throws an error", function (): void {
                  (this as SS).isSafeSpy.and.returnValue(false);
                  expect(() => {
                     (this as SS).testObject.getContent([(this as SS).assertion]);
                  }).toThrow();
               });
            });
         });
      });
   });

   describe("#getAttribute", () => {
      beforeEach(function (): void {
         (this as SS).attribute = "asd";
         (this as SS).key = AdaptedDataImplUtil.DEFAULT_ATTRIBUTE_KEY;

         const TEST_OBJECT: AdaptedData =
            AdaptedDataImplUtil.withDefaultAttribute((this as SS).attribute);
         (this as SS).testObject = TEST_OBJECT;
      });

      describe("WHEN the attribute does not exist", () => {
         it("THEN it throws an error", function (): void {
            expect(() => {
               AdaptedDataImplUtil.empty().getAttribute((this as SS).key);
            }).toThrow();
         });
      });

      it("returns the attribute", function (): void {
         expect((this as SS).testObject.getAttribute((this as SS).key)).toBe((this as SS).attribute);
      });

      describe("WHEN it is called with an assertion", () => {
         it("THEN it calls the 'test' method of the assertion with the attribute value as an argument", function (): void {
            (this as SS).testObject.getAttribute((this as SS).key, [(this as SS).assertion]);
            expect((this as SS).testSpy).toHaveBeenCalledTimes(1);
            expect((this as SS).testSpy.calls.argsFor(0))
               .toEqual([(this as SS).attribute]);
         });

         describe("WHEN the assertion succeeds", () => {
            it("THEN it returns the attribute value", function (): void {
               (this as SS).testSpy.and.returnValue(true);
               expect((this as SS).testObject.getAttribute((this as SS).key, [(this as SS).assertion]))
                  .toBe((this as SS).attribute);
            });
         });

         describe("WHEN the assertion fails", () => {
            beforeEach(function (): void {
               (this as SS).testSpy.and.returnValue(false);
               spyOn(console, "warn").and.callFake((): void => { });
            });

            it("THEN it calls the 'isSafe' method of the assertion", function (): void {
               (this as SS).testObject.getAttribute((this as SS).key, [(this as SS).assertion]);
               expect((this as SS).isSafeSpy).toHaveBeenCalledTimes(1);
            });

            describe("WHEN the assertion is safe", () => {
               it("THEN it does not throw an error and returns the content but prints a warning", function (): void {
                  (this as SS).isSafeSpy.and.returnValue(true);
                  expect(console.warn).not.toHaveBeenCalled();
                  expect(() => {
                     (this as SS).testObject.getAttribute((this as SS).key, [(this as SS).assertion]);
                  }).not.toThrow();
                  expect(console.warn).toHaveBeenCalledTimes(1);
               });
            });

            describe("WHEN the assertion is not safe", () => {
               it("THEN it throws an error", function (): void {
                  (this as SS).isSafeSpy.and.returnValue(false);
                  expect(() => {
                     (this as SS).testObject.getAttribute((this as SS).key, [(this as SS).assertion]);
                  }).toThrow();
               });
            });
         });
      });
   });
});