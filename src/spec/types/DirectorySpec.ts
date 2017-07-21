import { MockUtil } from "./../mock/MockUtil";
import { Directory } from "./../../main/types/Directory";
import { Module } from "./../../main/types/Module";
import { AdaptedDataFactory } from "./../mock/AdaptedDataFactory";
import { AdaptedData } from "./../../main/core/AdaptedData";
import * as path from "path";

describe("Directory", () => {
   beforeEach(function (): void {
      MockUtil.initialize();

      this.factory = new AdaptedDataFactory()
         .attr("name", "dir-name");

      this.setParentDirectoryCalledWith = [];

      this.mockModule = (): Module => {
         let currentModule: Module = new Module(null);
         spyOn(currentModule, "setParentDirectory").and.callFake(
            (directory: string): void => {
               this.setParentDirectoryCalledWith.push(directory);
            });
         return currentModule;
      };

      this.registerTwoModules = (): AdaptedData[] => {
         return MockUtil.registerAll([this.mockModule(), this.mockModule()]);
      };
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (): void {
         let testObj: Directory = new Directory(new AdaptedDataFactory(this.factory)
            .build());
         expect(testObj.allModules.length).toBe(0);
         expect(testObj.directories.length).toBe(0);
      });
   });

   describe("WHEN it is initialized with null or undefined", () => {
      it("THEN everything goes well", function (): void {
         expect(() => { new Directory(null); }).not.toThrow();
         expect(() => { new Directory(undefined); }).not.toThrow();
      });
   });

   describe("WHEN its name is empty", () => {
      it("THEN it throws an error", function (): void {
         const data: AdaptedData = new AdaptedDataFactory(this.factory)
            .attr("name", "")
            .build();
         expect((): void => { new Directory(data); }).toThrow();
      });
   });

   describe("WHEN it has two child modules", () => {
      beforeEach(function (): void {
         this.factory = new AdaptedDataFactory(this.factory)
            .children("Module", this.registerTwoModules());
      });

      it("THEN it contains them", function (): void {
         let testObj: Directory = new Directory(this.factory.build());
         expect(testObj.allModules.length).toBe(2);
      });

      describe("WHEN it has two child directories with two child modules each", () => {
         it("THEN it contains all directories and all modules", function (): void {
            let dir1: Directory = new Directory(new AdaptedDataFactory()
               .attr("name", "dir1")
               .children("Module", this.registerTwoModules())
               .build());
            expect(dir1.allModules.length).toBe(2);

            let dir2: Directory = new Directory(new AdaptedDataFactory()
               .attr("name", "dir2")
               .children("Module", this.registerTwoModules())
               .build());
            expect(dir2.allModules.length).toBe(2);

            let testObj: Directory = new Directory(new AdaptedDataFactory(this.factory)
               .children("Directory", MockUtil.registerAll([dir1, dir2]))
               .build());
            expect(testObj.directories.length).toBe(2);
            expect(testObj.directories[0]).toBe(dir1);
            expect(testObj.directories[1]).toBe(dir2);
            expect(testObj.allModules.length).toBe(6);
         });
      });
   });

   describe("#setParentDirectory", () => {
      describe("WHEN there is a complex structure of directories", () => {
         it("THEN it sets the correct parent directories of every module and directory", function (): void {
            let dir1: Directory = new Directory(new AdaptedDataFactory()
               .attr("name", "dir1")
               .children("Module", this.registerTwoModules())
               .build());

            let dir2: Directory = new Directory(new AdaptedDataFactory()
               .attr("name", "dir2")
               .children("Module", this.registerTwoModules())
               .build());

            let dir3: Directory = new Directory(new AdaptedDataFactory()
               .attr("name", "dir3")
               .children("Directory", MockUtil.registerAll([dir1, dir2]))
               .children("Module", this.registerTwoModules())
               .build());

            let testObj: Directory = new Directory(new AdaptedDataFactory(this.factory)
               .attr("name", "testObj")
               .child("Directory", MockUtil.registerMock(dir3))
               .children("Module", this.registerTwoModules())
               .build());

            testObj.setParentDirectory("root");

            const EXPECTED: string[] = [
               "root/testObj/dir3/dir1", "root/testObj/dir3/dir1",
               "root/testObj/dir3/dir2", "root/testObj/dir3/dir2",
               "root/testObj/dir3", "root/testObj/dir3",
               "root/testObj", "root/testObj",
            ];

            for (let index in EXPECTED) {
               EXPECTED[index] = path.normalize(EXPECTED[index]);
            }

            expect(this.setParentDirectoryCalledWith).toEqual(EXPECTED);
         });
      });
   });
});