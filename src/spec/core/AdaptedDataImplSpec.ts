import { AdaptedData } from "./../../main/core/AdaptedData";
import { AdaptedDataImplUtil } from "./../mock/AdaptedDataImplUtil";
import { MockAssertion } from "./../mock/MockAssertion";
import { Assertion } from "./../../main/assertions/Assertion";

describe("AdaptedDataImpl", () => {
   beforeEach(function (): void {
      const ASSERTION: Assertion = new MockAssertion();
      this.testSpy = spyOn(ASSERTION, "test").and.callThrough();
      this.isSafeSpy = spyOn(ASSERTION, "isSafe").and.callThrough();
      this.assertion = ASSERTION;
   });

   describe("WHEN it is instantiated with empty values", () => {
      it("THEN it does not throw any errors", function (): void {
         expect(AdaptedDataImplUtil.empty).not.toThrow();
      });
   });

   describe("#getSingleChild", () => {
      describe("WHEN the object has a single child of that type", () => {
         it("THEN it returns the child", function (): void {
            const CHILD: AdaptedData = AdaptedDataImplUtil.empty();
            const TEST_OBJECT: AdaptedData =
               AdaptedDataImplUtil.withDefaultChildren(CHILD);

            expect(() => {
               TEST_OBJECT.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            expect(TEST_OBJECT.getSingleChild(
               AdaptedDataImplUtil.DEFAULT_CHILD_TYPE)).toBe(CHILD);
         });
      });

      describe("WHEN the object has no children of that type", () => {
         it("THEN it throws an error", function (): void {
            const TEST_OBJECT: AdaptedData = AdaptedDataImplUtil.empty();

            expect(() => {
               TEST_OBJECT.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).toThrow();
         });
      });

      describe("WHEN the object has more than one child of that type", () => {
         it("THEN it throws an error", function (): void {
            const TEST_OBJECT: AdaptedData = AdaptedDataImplUtil.withDefaultChildren(
               AdaptedDataImplUtil.empty(), AdaptedDataImplUtil.empty());

            expect(() => {
               TEST_OBJECT.getSingleChild(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).toThrow();
         });
      });
   });

   describe("#getChildren", () => {
      describe("WHEN the object has a single child of that type", () => {
         it("THEN it returns an array containing the child", function (): void {
            const CHILD: AdaptedData = AdaptedDataImplUtil.empty();
            const TEST_OBJECT: AdaptedData =
               AdaptedDataImplUtil.withDefaultChildren(CHILD);

            expect(() => {
               TEST_OBJECT.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            const RESULT: AdaptedData[] =
               TEST_OBJECT.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            expect(RESULT.length).toBe(1);
            expect(RESULT[0]).toBe(CHILD);
         });
      });

      describe("WHEN the object has no children of that type", () => {
         it("THEN it returns an empty array", function (): void {
            const TEST_OBJECT: AdaptedData = AdaptedDataImplUtil.empty();

            expect(() => {
               TEST_OBJECT.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            const RESULT: AdaptedData[] =
               TEST_OBJECT.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            expect(RESULT.length).toBe(0);
         });
      });

      describe("WHEN the object has more than one child of that type", () => {
         it("THEN it returns an array containing the children", function (): void {
            const CHILD1: AdaptedData = AdaptedDataImplUtil.empty();
            const CHILD2: AdaptedData = AdaptedDataImplUtil.empty();
            const TEST_OBJECT: AdaptedData =
               AdaptedDataImplUtil.withDefaultChildren(CHILD1, CHILD2);

            expect(() => {
               TEST_OBJECT.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            }).not.toThrow();

            const RESULT: AdaptedData[] =
               TEST_OBJECT.getChildren(AdaptedDataImplUtil.DEFAULT_CHILD_TYPE);
            expect(RESULT.length).toBe(2);
            expect(RESULT[0]).toBe(CHILD1);
            expect(RESULT[1]).toBe(CHILD2);
         });
      });
   });

   describe("#getContent", () => {
      beforeEach(function (): void {
         const CONTENT: string = "asd";
         this.content = CONTENT;

         const TEST_OBJECT: AdaptedData = AdaptedDataImplUtil.withContent(CONTENT);
         this.testObject = AdaptedDataImplUtil.withContent(CONTENT);
      });

      it("returns the same content the data was instantiated with", function (): void {
         expect(this.testObject.getContent()).toBe(this.content);
      });

      describe("WHEN it is called with an assertion", () => {
         it("THEN it calls the 'test' method of the assertion with the content as an argument", function (): void {
            this.testObject.getContent([this.assertion]);
            expect(this.testSpy).toHaveBeenCalledTimes(1);
            expect(this.testSpy.calls.argsFor(0)).toEqual([this.content]);
         });

         describe("WHEN the assertion succeeds", () => {
            it("THEN it returns the content", function (): void {
               this.testSpy.and.returnValue(true);
               expect(this.testObject.getContent()).toBe(this.content);
            });
         });

         describe("WHEN the assertion fails", () => {
            beforeEach(function (): void {
               this.testSpy.and.returnValue(false);
               spyOn(console, "warn").and.callFake((): void => {});
            });

            it("THEN it calls the 'isSafe' method of the assertion", function (): void {
               this.testObject.getContent([this.assertion]);
               expect(this.isSafeSpy).toHaveBeenCalledTimes(1);
            });

            describe("WHEN the assertion is safe", () => {
               it("THEN it does not throw an error and returns the content but prints a warning", function (): void {
                  this.isSafeSpy.and.returnValue(true);
                  expect(console.warn).not.toHaveBeenCalled();
                  expect(() => {
                     this.testObject.getContent([this.assertion]);
                  }).not.toThrow();
                  expect(console.warn).toHaveBeenCalledTimes(1);
               });
            });

            describe("WHEN the assertion is not safe", () => {
               it("THEN it throws an error", function (): void {
                  this.isSafeSpy.and.returnValue(false);
                  expect(() => { this.testObject.getContent([this.assertion]); }).toThrow();
               });
            });
         });
      });
   });

   describe("#getAttribute", () => {
      beforeEach(function (): void {
         const ATTRIBUTE: string = "asd";
         this.attribute = ATTRIBUTE;
         this.key = AdaptedDataImplUtil.DEFAULT_ATTRIBUTE_KEY;

         const TEST_OBJECT: AdaptedData =
            AdaptedDataImplUtil.withDefaultAttribute(ATTRIBUTE);
         this.testObject = TEST_OBJECT;
      });

      describe("WHEN the attribute does not exist", () => {
         it("THEN it throws an error", function (): void {
            expect(() => {
               AdaptedDataImplUtil.empty().getAttribute(this.key);
            }).toThrow();
         });
      });

      it("returns the attribute", function (): void {
         expect(this.testObject.getAttribute(this.key)).toBe(this.attribute);
      });

      describe("WHEN it is called with an assertion", () => {
         it("THEN it calls the 'test' method of the assertion with the attribute value as an argument", function (): void {
            this.testObject.getAttribute(this.key, [this.assertion]);
            expect(this.testSpy).toHaveBeenCalledTimes(1);
            expect(this.testSpy.calls.argsFor(0)).toEqual([this.attribute]);
            // let testSpy: jasmine.Spy = this.testSpy;
            // expect(testSpy).toHaveBeenCalledTimes(1);
            // expect(testSpy.calls.argsFor(0)).toEqual([this.attribute]);
         });

         describe("WHEN the assertion succeeds", () => {
            it("THEN it returns the attribute value", function (): void {
               this.testSpy.and.returnValue(true);
               expect(this.testObject.getAttribute(this.key, [this.assertion]))
                  .toBe(this.attribute);
            });
         });

         describe("WHEN the assertion fails", () => {
            beforeEach(function (): void {
               this.testSpy.and.returnValue(false);
               spyOn(console, "warn").and.callFake((): void => {});
            });

            it("THEN it calls the 'isSafe' method of the assertion", function (): void {
               this.testObject.getAttribute(this.key, [this.assertion]);
               expect(this.isSafeSpy).toHaveBeenCalledTimes(1);
            });

            describe("WHEN the assertion is safe", () => {
               it("THEN it does not throw an error and returns the content but prints a warning", function (): void {
                  this.isSafeSpy.and.returnValue(true);
                  expect(console.warn).not.toHaveBeenCalled();
                  expect(() => {
                     this.testObject.getAttribute(this.key, [this.assertion]);
                  }).not.toThrow();
                  expect(console.warn).toHaveBeenCalledTimes(1);
               });
            });

            describe("WHEN the assertion is not safe", () => {
               it("THEN it throws an error", function (): void {
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