import { MockUtil } from "./../mock/MockUtil";
import { Module } from "./../../main/types/Module";
import { Dependency } from "./../../main/types/Dependency";
import { AdaptedDataFactory } from "./../mock/AdaptedDataFactory";
import { AdaptedData } from "./../../main/core/AdaptedData";
import * as path from "path";

describe("Module", () => {
   beforeEach(function (): void {
      MockUtil.initialize();
      this.id = "lib-module-name1";
      this.dependencies = [new Dependency(null), new Dependency(null)];

      this.build = (): Module => {
         const DATA: AdaptedData = new AdaptedDataFactory()
            .attr("id", this.id)
            .children("Dependency", MockUtil.registerAll(this.dependencies))
            .build();
         return new Module(DATA);
      };
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (): void {
         let testObj: Module = this.build();

         expect(testObj.id).toBe(this.id);
         expect(testObj.directory).toBeUndefined();

         expect(testObj.dependencies[0]).toBe(this.dependencies[0]);
         expect(testObj.dependencies[1]).toBe(this.dependencies[1]);
      });
   });

   describe("WHEN it is initialized with null or undefined", () => {
      it("THEN everything goes well", function (): void {
         expect(() => { new Module(null); }).not.toThrow();
         expect(() => { new Module(undefined); }).not.toThrow();
      });
   });

   describe("WHEN its ID is not in kebab-case", () => {
      it("THEN it throws an error", function (): void {
         this.id = "libModuleName";
         expect(this.build).toThrow();
      });
   });

   describe("#setParentDirectory", () => {
      describe("WHEN called with an absolute path", () => {
         it("THEN joins the given parameter with its ID", function (): void {
            let testObj: Module = this.build();
            expect(testObj.directory).toBeUndefined();

            const DIR: string = "/tmp/asd/test";
            testObj.setParentDirectory(DIR);
            expect(testObj.directory).toBe(path.join(DIR, this.id));
         });
      });

      describe("WHEN called with a relative path", () => {
         it("THEN joins the given parameter with its ID", function (): void {
            let testObj: Module = this.build();
            expect(testObj.directory).toBeUndefined();

            const DIR: string = "./asd/test";
            testObj.setParentDirectory(DIR);
            expect(testObj.directory).toBe(path.join(DIR, this.id));
         });
      });
   });
});