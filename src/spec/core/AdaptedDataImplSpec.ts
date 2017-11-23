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
   beforeEach(function (this: SS): void {
      this.assertion = new MockAssertion();
      this.testSpy = spyOn(this.assertion, "test").and.callThrough();
      this.isSafeSpy = spyOn(this.assertion, "isSafe").and.callThrough();
   });

   describe("WHEN it is instantiated with empty values", () => {
      it("THEN it does not throw any errors", function (this: SS): void {
         expect(AdaptedDataImplUtil.empty).not.toThrow();
      });
   });

   describe("#getSingleChild", () => {
      describe("WHEN the object has a single child of that type", () => {
         it("THEN it returns the child", function (this: SS): void {
            const child: AdaptedData = AdaptedDataImplUtil.empty();
            const testObject: AdaptedData =
               AdaptedDataImplUtil.withDefaultChildren(child);

            expect((): void => {
               testObject.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            expect(testObject.getSingleChild(
               AdaptedDataImplUtil.DEFAULT_CHILD_TYPE)).toBe(child);
         });
      });

      describe("WHEN the object has no children of that type", () => {
         it("THEN it throws an error", function (this: SS): void {
            const testObject: AdaptedData = AdaptedDataImplUtil.empty();

            expect((): void => {
               testObject.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).toThrow();
         });
      });

      describe("WHEN the object has more than one child of that type", () => {
         it("THEN it throws an error", function (this: SS): void {
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
         it("THEN it returns an array containing the child", function (this: SS): void {
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
         it("THEN it returns an empty array", function (this: SS): void {
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
         it("THEN it returns an array containing the children", function (this: SS): void {
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
      beforeEach(function (this: SS): void {
         const content: string = "asd";
         this.content = content;

         const TEST_OBJECT: AdaptedData = AdaptedDataImplUtil.withContent(content);
         this.testObject = AdaptedDataImplUtil.withContent(content);
      });

      it("returns the same content the data was instantiated with", function (this: SS): void {
         expect(this.testObject.getContent()).toBe(this.content);
      });

      describe("WHEN it is called with an assertion", () => {
         it("THEN it calls its 'test' method with the content", function (this: SS): void {
            this.testObject.getContent([this.assertion]);
            expect(this.testSpy).toHaveBeenCalledTimes(1);
            expect(this.testSpy.calls.argsFor(0))
               .toEqual([this.content]);
         });

         describe("WHEN the assertion succeeds", () => {
            it("THEN it returns the content", function (this: SS): void {
               this.testSpy.and.returnValue(true);
               expect(this.testObject.getContent()).toBe(this.content);
            });
         });

         describe("WHEN the assertion fails", () => {
            beforeEach(function (this: SS): void {
               this.testSpy.and.returnValue(false);
               spyOn(console, "warn").and.callFake((): void => { });
            });

            it("THEN it calls the 'isSafe' method of the assertion", function (this: SS): void {
               this.testObject.getContent([this.assertion]);
               expect(this.isSafeSpy).toHaveBeenCalledTimes(1);
            });

            describe("WHEN the assertion is safe", () => {
               it("THEN it prints a warning and returns the content", function (this: SS): void {
                  this.isSafeSpy.and.returnValue(true);
                  expect(console.warn).not.toHaveBeenCalled();
                  expect(() => {
                     this.testObject.getContent([this.assertion]);
                  }).not.toThrow();
                  expect(console.warn).toHaveBeenCalledTimes(1);
               });
            });

            describe("WHEN the assertion is not safe", () => {
               it("THEN it throws an error", function (this: SS): void {
                  this.isSafeSpy.and.returnValue(false);
                  expect(() => {
                     this.testObject.getContent([this.assertion]);
                  }).toThrow();
               });
            });
         });
      });
   });

   describe("#getAttribute", () => {
      beforeEach(function (this: SS): void {
         this.attribute = "asd";
         this.key = AdaptedDataImplUtil.DEFAULT_ATTRIBUTE_KEY;

         const TEST_OBJECT: AdaptedData =
            AdaptedDataImplUtil.withDefaultAttribute(this.attribute);
         this.testObject = TEST_OBJECT;
      });

      describe("WHEN the attribute does not exist", () => {
         it("THEN it throws an error", function (this: SS): void {
            expect(() => {
               AdaptedDataImplUtil.empty().getAttribute(this.key);
            }).toThrow();
         });
      });

      it("returns the attribute", function (this: SS): void {
         expect(this.testObject.getAttribute(this.key)).toBe(this.attribute);
      });

      describe("WHEN it is called with an assertion", () => {
         it("THEN it calls its 'test' method with the attribute value", function (this: SS): void {
            this.testObject.getAttribute(this.key, [this.assertion]);
            expect(this.testSpy).toHaveBeenCalledTimes(1);
            expect(this.testSpy.calls.argsFor(0))
               .toEqual([this.attribute]);
         });

         describe("WHEN the assertion succeeds", () => {
            it("THEN it returns the attribute value", function (this: SS): void {
               this.testSpy.and.returnValue(true);
               expect(this.testObject.getAttribute(this.key, [this.assertion]))
                  .toBe(this.attribute);
            });
         });

         describe("WHEN the assertion fails", () => {
            beforeEach(function (this: SS): void {
               this.testSpy.and.returnValue(false);
               spyOn(console, "warn").and.callFake((): void => { });
            });

            it("THEN it calls the 'isSafe' method of the assertion", function (this: SS): void {
               this.testObject.getAttribute(this.key, [this.assertion]);
               expect(this.isSafeSpy).toHaveBeenCalledTimes(1);
            });

            describe("WHEN the assertion is safe", () => {
               it("THEN it prints a warning and returns the content", function (this: SS): void {
                  this.isSafeSpy.and.returnValue(true);
                  expect(console.warn).not.toHaveBeenCalled();
                  expect(() => {
                     this.testObject.getAttribute(this.key, [this.assertion]);
                  }).not.toThrow();
                  expect(console.warn).toHaveBeenCalledTimes(1);
               });
            });

            describe("WHEN the assertion is not safe", () => {
               it("THEN it throws an error", function (this: SS): void {
                  this.isSafeSpy.and.returnValue(false);
                  expect(() => {
                     this.testObject.getAttribute(this.key, [this.assertion]);
                  }).toThrow();
               });
            });
         });
      });
   });
});