import { MockUtil } from "../mock/MockUtil";
import { Directory } from "../../main/types/Directory";
import { Module } from "../../main/types/Module";
import { AdaptedDataFactory } from "../mock/AdaptedDataFactory";
import { AdaptedData } from "../../main/core/AdaptedData";
import * as path from "path";
import { ModuleMock } from "../mock/types/ModuleMock";
import { ModuleType } from "../../main/ModuleType";
import { DirectoryImpl } from "../../main/types/impl/DirectoryImpl";
import { DirectoryMock } from "../mock/types/DirectoryMock";

interface SS {
   addDirectories(...directories: DirectoryMock[]): void;
   addModules(...modules: ModuleMock[]): void;
   parentDir: string;
   dirName: string;
   build(): Directory;
}

describe("Directory", () => {
   beforeEach(function (this: SS): void {
      MockUtil.initialize();

      let mockedDirectories: DirectoryMock[] = [];
      this.addDirectories = (...directories: DirectoryMock[]): void => {
         mockedDirectories = mockedDirectories.concat(directories);
      };

      let mockedModules: ModuleMock[] = [];
      this.addModules = (...modules: ModuleMock[]): void => {
         mockedModules = mockedModules.concat(modules);
      };

      this.parentDir = "";
      this.dirName = "dir-name";

      this.build = (): Directory => new DirectoryImpl(new AdaptedDataFactory()
         .attr("name", this.dirName)
         .children("Directory", MockUtil.registerAll(mockedDirectories))
         .children("Module", MockUtil.registerAll(mockedModules))
         .build(), this.parentDir);
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (this: SS): void {
         this.parentDir = "parentDir";
         expect(this.build).not.toThrow();
         expect(this.build().dirPath)
            .toBe(path.join(this.parentDir, this.dirName));
      });
   });

   describe("WHEN its name is empty", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.dirName = "";
         expect(this.build).toThrow();
      });
   });

   describe("WHEN it has two modules with the same ID", () => {
      it("THEN it throws an error", function (this: SS): void {
         const moduleId: string = "some-module-id";
         this.addModules(new ModuleMock(moduleId), new ModuleMock(moduleId));
         expect(this.build).toThrow();
      });
   });

   describe("WHEN it has two child modules", () => {
      beforeEach(function (this: SS): void {
         this.addModules(new ModuleMock(), new ModuleMock);
      });

      it("THEN it contains them", function (this: SS): void {
         const testObj: Directory = this.build();
         expect(Object.keys(testObj.modules).length).toBe(2);
      });

      describe("WHEN it has two child directories with two child modules each", () => {
         it("THEN it contains all directories and all modules", function (this: SS): void {
            this.addDirectories(new DirectoryMock("",
               [new ModuleMock(), new ModuleMock()]));

            this.addDirectories(new DirectoryMock("",
               [new ModuleMock(), new ModuleMock()]));

            const testObj: Directory = this.build();
            expect(testObj.directModules.length).toBe(2);
            expect(Object.keys(testObj.modules).length).toBe(6);
         });
      });
   });
});