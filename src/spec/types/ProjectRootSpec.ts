import { MockUtil } from "../mock/MockUtil";
import { Directory } from "../../main/types/Directory";
import { ProjectRoot } from "../../main/types/ProjectRoot";
import { AdaptedDataFactory } from "../mock/AdaptedDataFactory";
import { AdaptedData } from "../../main/core/AdaptedData";
import { Module } from "../../main/types/Module";
import { ModuleType } from "../../main/ModuleType";
import { Dependency } from "../../main/types/Dependency";
import { DirectoryMock } from "../mock/types/DirectoryMock";
import { ProjectRootImpl } from "../../main/types/impl/ProjectRootImpl";
import { ModuleMock } from "../mock/types/ModuleMock";
import { DependencyImpl } from "../../main/types/impl/DependencyImpl";
import { DependencyMock } from "../mock/types/DependencyMock";

interface SS {
   modules: Module[];
   makeModuleMap(...modules: ModuleMock[]): { [id: string]: Module };
   rootDirectory: DirectoryMock;
   additionalDirectory?: DirectoryMock;
   hasRootDirectory: boolean;
   build(): ProjectRoot;
}

describe("ProjectRoot", () => {
   beforeEach(function (this: SS): void {
      MockUtil.initialize();
      this.rootDirectory = new DirectoryMock();
      this.hasRootDirectory = true;

      this.modules = [];
      this.makeModuleMap = (...modules: ModuleMock[]): { [id: string]: Module } => {
         this.modules = modules;
         const result: { [id: string]: ModuleMock } = {};
         for (const currentModule of modules) {
            result[currentModule.id] = currentModule;
         }
         return result;
      };

      this.build = (): ProjectRoot => {
         const directories: (DirectoryMock | undefined)[] = this.hasRootDirectory
            ? [this.rootDirectory, this.additionalDirectory]
            : [];
         return new ProjectRootImpl(new AdaptedDataFactory()
            .children("Directory", MockUtil.registerAll(directories))
            .build());
      };
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (this: SS): void {
         expect(this.build).not.toThrow();
      });
   });

   describe("WHEN there is no root directory", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.hasRootDirectory = false;
         expect(this.build).toThrow();
      });
   });

   describe("WHEN there are two root directories", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.additionalDirectory = new DirectoryMock();
         expect(this.build).toThrow();
      });
   });

   describe("WHEN there is a cyclic dependency", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1", ["module-2"]),
            new ModuleMock("module-2", ["module-3"]),
            new ModuleMock("module-3", ["module-1"])
         );
         expect(this.build).toThrowError("There is the following cyclic " +
            "dependency: module-1 -> module-2 -> module-3 -> module-1");
      });
   });

   describe("WHEN there is a dependency to a module that does not exist", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1", ["module-2"]),
            new ModuleMock("module-2", ["module-3"]),
            new ModuleMock("module-3", ["module-4"])
         );
         expect(this.build).toThrowError("Module 'module-3' depends on " +
            "'module-4' which does not exist");
      });
   });

   describe("WHEN there is a dependency between invalid module types", () => {
      it("THEN it throws an error", function (this: SS): void {
         const error: string = "Module 'module-1' cannot depend on module 'module-2'. " +
            "The only types it can depend on are: ";
         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1", ["module-2"], "", ModuleType.CONTRACT),
            new ModuleMock("module-2", [], "", ModuleType.GROUP)
         );
         expect(this.build).toThrowError(error + ModuleType.CONTRACT);

         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1", ["module-2"], "", ModuleType.UI),
            new ModuleMock("module-2", [], "", ModuleType.SERVER)
         );
         expect(this.build).toThrowError(error +
            [ModuleType.CONTRACT, ModuleType.UI].join(", "));

         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1", ["module-2"], "", ModuleType.SERVER),
            new ModuleMock("module-2", [], "", ModuleType.UI)
         );
         expect(this.build).toThrowError(error +
            [ModuleType.CONTRACT, ModuleType.SERVER].join(", "));
      });
   });

   describe("#allModulesOfType", () => {
      it("returns the modules of the specified type", function (this: SS): void {
         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1", [], "", ModuleType.SERVER),
            new ModuleMock("module-2", [], "", ModuleType.UI),
            new ModuleMock("module-3", [], "", ModuleType.UI),
            new ModuleMock("module-4", [], "", ModuleType.CONTRACT),
            new ModuleMock("module-5", [], "", ModuleType.CONTRACT),
            new ModuleMock("module-6", [], "", ModuleType.GROUP)
         );

         const getModuleIds: (modules: Module[]) => string[] =
            (modules: Module[]): string[] => {
               const result: string[] = [];
               for (let module of modules) {
                  result.push(module.id);
               }
               return result;
            };

         const testObj: ProjectRoot = this.build();

         expect(getModuleIds(testObj.allModulesOfType(ModuleType.SERVER)))
            .toEqual(["module-1"]);
         expect(getModuleIds(testObj.allModulesOfType(ModuleType.UI)))
            .toEqual(["module-2", "module-3"]);
         expect(getModuleIds(testObj.allModulesOfType(ModuleType.CONTRACT)))
            .toEqual(["module-4", "module-5"]);
         expect(getModuleIds(testObj.allModulesOfType(ModuleType.GROUP)))
            .toEqual(["module-6"]);
      });
   });

   describe("#getDependentModuleIds", () => {
      beforeEach(function (this: SS): void {
         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1"),
            new ModuleMock("module-2", ["module-1"]),
            new ModuleMock("module-3", ["module-2", "module-1"])
         );
      });

      describe("WHEN it is called with a module ID", () => {
         it("THEN it returns the correct values", function (this: SS): void {
            expect(this.build().getDependentModuleIds("module-1"))
               .toEqual(["module-2", "module-3"]);
            expect(this.build().getDependentModuleIds("module-2")).toEqual(["module-3"]);
            expect(this.build().getDependentModuleIds("module-3")).toEqual([]);
         });
      });

      describe("WHEN it is called with a module object", () => {
         it("THEN it returns the correct values", function (this: SS): void {
            expect(this.build().getDependentModuleIds(this.modules[0]))
               .toEqual(["module-2", "module-3"]);
            expect(this.build().getDependentModuleIds(this.modules[1]))
               .toEqual(["module-3"]);
            expect(this.build().getDependentModuleIds(this.modules[2])).toEqual([]);
         });
      });
   });

   describe("#getBuildOrder", () => {
      it("returns the modules grouped and ordered correctly", function (this: SS): void {
         this.rootDirectory.modules = this.makeModuleMap(
            new ModuleMock("module-1", ["module-3"]),
            new ModuleMock("module-2", ["module-3", "module-4"]),
            new ModuleMock("module-3", []),
            new ModuleMock("module-4", ["module-5", "module-6"]),
            new ModuleMock("module-5", ["module-6"]),
            new ModuleMock("module-6", [])
         );
         const testObj: ProjectRoot = this.build();
         expect(testObj.getBuildOrder("module-1")).toEqual(["module-3", "module-1"]);
         expect(testObj.getBuildOrder("module-2")).toEqual([
            "module-6", "module-5", ["module-3", "module-4"], "module-2"
         ]);
         expect(testObj.getBuildOrder("module-3")).toEqual(["module-3"]);
         expect(testObj.getBuildOrder("module-4")).toEqual([
            "module-6", "module-5", "module-4"
         ]);
         expect(testObj.getBuildOrder("module-5")).toEqual(["module-6", "module-5"]);
         expect(testObj.getBuildOrder("module-6")).toEqual(["module-6"]);
      });

      describe("WHEN it is called with a module that does not exist", () => {
         it("THEN it throws an error", function (this: SS): void {
            const moduleId: string = "non-existent-module";
            const errorMessage: string = "Module '" + moduleId + "' does not exist";

            expect(() => {
               this.build().getBuildOrder(moduleId);
            }).toThrowError(errorMessage);

            expect(() => {
               this.build().getBuildOrder(new ModuleMock(moduleId));
            }).toThrowError(errorMessage);
         });
      });
   });
});