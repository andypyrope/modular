import { MockUtil } from "./../mock/MockUtil";
import { Directory } from "./../../main/types/Directory";
import { ProjectRoot } from "./../../main/types/ProjectRoot";
import { AdaptedDataFactory } from "./../mock/AdaptedDataFactory";
import { AdaptedData } from "./../../main/core/AdaptedData";
import { Module } from "./../../main/types/Module";

describe("ProjectRoot", () => {
   beforeEach(function (): void {
      MockUtil.initialize();
      this.rootDirectory = new Directory(null);
      this.rootDirectory.allModules = [];
      this.webpackFile = "wp-config.json";
      this.tsFolder = "ts";
      this.stylesFolder = "styles";

      this.build = (): ProjectRoot => {
         const DATA: AdaptedData = new AdaptedDataFactory()
            .attr("webpackFile", this.webpackFile)
            .attr("tsFolder", this.tsFolder)
            .attr("stylesFolder", this.stylesFolder)
            .children("Directory", MockUtil.registerAll([this.rootDirectory]))
            .build();
         return new ProjectRoot(DATA);
      };
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (): void {
         let testObj: ProjectRoot = this.build();

         expect(testObj.webpackFile).toBe(this.webpackFile);
         expect(testObj.tsFolder).toBe(this.tsFolder);
         expect(testObj.stylesFolder).toBe(this.stylesFolder);
      });
   });

   describe("WHEN its root directory contains two modules with the same ID", () => {
      it("THEN it throws an error with the correct message upon initialization", function (): void {
         this.rootDirectory.allModules = [new Module(null), new Module(null)];
         this.rootDirectory.allModules[0].id = this.rootDirectory.allModules[1].id = "a";
         expect(this.build).toThrowError("There is more than one module with ID 'a'");
      });
   });

   describe("WHEN its root directory contains many modules with different IDs", () => {
      it("THEN it does not throw an error upon initialization", function (): void {
         this.rootDirectory.allModules = [
            new Module(null), new Module(null),
            new Module(null)
         ];

         this.rootDirectory.allModules[0].id = "a";
         this.rootDirectory.allModules[1].id = "bracada";
         this.rootDirectory.allModules[2].id = "bra";
         expect(this.build).not.toThrow();
      });
   });

   describe("WHEN it is initialized with null or undefined", () => {
      it("THEN everything goes well", function (): void {
         expect(() => { new ProjectRoot(null); }).not.toThrow();
         expect(() => { new ProjectRoot(undefined); }).not.toThrow();
      });
   });
});