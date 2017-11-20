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
   beforeEach(function (): void {
      MockUtil.initialize();

      let mockedDirectories: DirectoryMock[] = [];
      (this as SS).addDirectories = (...directories: DirectoryMock[]): void => {
         mockedDirectories = mockedDirectories.concat(directories);
      };

      let mockedModules: ModuleMock[] = [];
      (this as SS).addModules = (...modules: ModuleMock[]): void => {
         mockedModules = mockedModules.concat(modules);
      };

      (this as SS).parentDir = "";
      (this as SS).dirName = "dir-name";

      (this as SS).build = (): Directory => new DirectoryImpl(new AdaptedDataFactory()
         .attr("name", (this as SS).dirName)
         .children("Directory", MockUtil.registerAll(mockedDirectories))
         .children("Module", MockUtil.registerAll(mockedModules))
         .build(), (this as SS).parentDir);
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (): void {
         (this as SS).parentDir = "parentDir";
         expect((this as SS).build).not.toThrow();
         expect((this as SS).build().dirPath)
            .toBe(path.join((this as SS).parentDir, (this as SS).dirName));
      });
   });

   describe("WHEN its name is empty", () => {
      it("THEN it throws an error", function (): void {
         (this as SS).dirName = "";
         expect((this as SS).build).toThrow();
      });
   });

   describe("WHEN it has two modules with the same ID", () => {
      it("THEN it throws an error", function (): void {
         const moduleId: string = "some-module-id";
         (this as SS).addModules(new ModuleMock(moduleId), new ModuleMock(moduleId));
         expect((this as SS).build).toThrow();
      });
   });

   describe("WHEN it has two child modules", () => {
      beforeEach(function (): void {
         (this as SS).addModules(new ModuleMock(), new ModuleMock);
      });

      it("THEN it contains them", function (): void {
         const testObj: Directory = (this as SS).build();
         expect(Object.keys(testObj.modules).length).toBe(2);
      });

      describe("WHEN it has two child directories with two child modules each", () => {
         it("THEN it contains all directories and all modules", function (): void {
            (this as SS).addDirectories(new DirectoryMock("",
               [new ModuleMock(), new ModuleMock()]));

            (this as SS).addDirectories(new DirectoryMock("",
               [new ModuleMock(), new ModuleMock()]));

            const testObj: Directory = (this as SS).build();
            expect(testObj.directModules.length).toBe(2);
            expect(Object.keys(testObj.modules).length).toBe(6);
         });
      });
   });
});