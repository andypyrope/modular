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

      let moduleIndex: number = 1;
      this.mockedModules = [];

      this.mockModule = (): Module => {
         let currentModule: Module = new Module(null);
         currentModule.id = "module-" + (moduleIndex++);
         this.mockedModules.push(currentModule);
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
         expect(Object.keys(testObj.modules).length).toBe(0);
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
         const DATA: AdaptedData = new AdaptedDataFactory(this.factory)
            .attr("name", "")
            .build();
         expect((): void => { new Directory(DATA); }).toThrow();
      });
   });

   describe("WHEN it has two modules with the same ID", () => {
      it("THEN it throws an error", function (): void {
         const MODULE_1: Module = this.mockModule();
         const MODULE_2: Module = this.mockModule();
         MODULE_2.id = MODULE_1.id;

         const DATA: AdaptedData = new AdaptedDataFactory(this.factory)
            .attr("name", "")
            .children("Module", MockUtil.registerAll([MODULE_1, MODULE_2]))
            .build();
         expect((): void => { new Directory(DATA); }).toThrow();
      });
   });

   describe("WHEN it has two child modules", () => {
      beforeEach(function (): void {
         this.factory = new AdaptedDataFactory(this.factory)
            .children("Module", this.registerTwoModules());
      });

      it("THEN it contains them", function (): void {
         let testObj: Directory = new Directory(this.factory.build());
         expect(Object.keys(testObj.modules).length).toBe(2);
      });

      describe("WHEN it has two child directories with two child modules each", () => {
         it("THEN it contains all directories and all modules", function (): void {
            let dir1: Directory = new Directory(new AdaptedDataFactory()
               .attr("name", "dir1")
               .children("Module", this.registerTwoModules())
               .build());
            expect(Object.keys(dir1.modules).length).toBe(2);

            let dir2: Directory = new Directory(new AdaptedDataFactory()
               .attr("name", "dir2")
               .children("Module", this.registerTwoModules())
               .build());
            expect(Object.keys(dir2.modules).length).toBe(2);

            let testObj: Directory = new Directory(new AdaptedDataFactory(this.factory)
               .children("Directory", MockUtil.registerAll([dir1, dir2]))
               .build());
            expect(Object.keys(testObj.modules).length).toBe(6);
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

            const EXPECTED_MODULE_DIRECTORIES: string[] = [
               "root/testObj/dir3/dir1/module-1", "root/testObj/dir3/dir1/module-2",
               "root/testObj/dir3/dir2/module-3", "root/testObj/dir3/dir2/module-4",
               "root/testObj/dir3/module-5", "root/testObj/dir3/module-6",
               "root/testObj/module-7", "root/testObj/module-8",
            ];

            const actualModuleDirectories: string[] = [];

            for (let index in EXPECTED_MODULE_DIRECTORIES) {
               EXPECTED_MODULE_DIRECTORIES[index] =
                  path.normalize(EXPECTED_MODULE_DIRECTORIES[index]);
               actualModuleDirectories.push(this.mockedModules[index].directory);
            }

            expect(actualModuleDirectories).toEqual(EXPECTED_MODULE_DIRECTORIES);
         });
      });
   });
});