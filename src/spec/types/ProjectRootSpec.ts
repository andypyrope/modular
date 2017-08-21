import { MockUtil } from "./../mock/MockUtil";
import { Directory } from "./../../main/types/Directory";
import { ProjectRoot } from "./../../main/types/ProjectRoot";
import { AdaptedDataFactory } from "./../mock/AdaptedDataFactory";
import { AdaptedData } from "./../../main/core/AdaptedData";
import { Module } from "./../../main/types/Module";
import { ModuleType } from "./../../main/types/ModuleType";
import { Dependency } from "./../../main/types/Dependency";

describe("ProjectRoot", () => {
   beforeEach(function (): void {
      MockUtil.initialize();
      this.rootDirectory = new Directory(null);
      (this.rootDirectory as Directory).modules = {};
      this.webpackFile = "wp-config.json";
      this.tsFolder = "ts";
      this.stylesFolder = "styles";

      this.makeModules = (info: { [id: string]: [ModuleType, string[]] }):
         { [id: string]: Module } => {
         const RESULT: { [id: string]: Module } = {};
         for (let id in info) {
            RESULT[id] = new Module(null);
            RESULT[id].id = id;
            RESULT[id].type = info[id][0];
            RESULT[id].dependencies = [];
            for (let dependencyId of info[id][1]) {
               const DEPENDENCY: Dependency = new Dependency(null);
               DEPENDENCY.id = dependencyId;
               RESULT[id].dependencies.push(DEPENDENCY);
            }
         }
         return RESULT;
      };
      (this.rootDirectory as Directory).modules = this.makeModules({
         "module-0": [ModuleType.UI, ["module-2"]],
         "module-1": [ModuleType.SERVER, ["module-2"]],
         "module-2": [ModuleType.CONTRACT, []],
         "module-3": [ModuleType.GROUP, ["module-0", "module-1"]]
      });

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

   describe("WHEN there is a cyclic dependency", () => {
      it("THEN it throws an error", function (): void {
         (this.rootDirectory as Directory).modules = this.makeModules({
            "module-1": [ModuleType.CONTRACT, ["module-2"]],
            "module-2": [ModuleType.CONTRACT, ["module-3"]],
            "module-3": [ModuleType.CONTRACT, ["module-1"]],
         });
         expect(this.build).toThrowError("There is the following cyclic dependency: " +
            "module-1 -> module-2 -> module-3 -> module-1");
      });
   });

   describe("WHEN there is a dependency to a module that does not exist", () => {
      it("THEN it throws an error", function (): void {
         (this.rootDirectory as Directory).modules = this.makeModules({
            "module-1": [ModuleType.CONTRACT, ["module-2"]],
            "module-2": [ModuleType.CONTRACT, ["module-3"]],
            "module-3": [ModuleType.CONTRACT, ["module-4"]],
         });
         expect(this.build).toThrowError("Module 'module-3' depends on 'module-4' " +
            "which does not exist");
      });
   });

   describe("WHEN there is a dependency between invalid module types", () => {
      it("THEN it throws an error", function (): void {
         const ERROR: string = "Module 'module-1' cannot depend on module 'module-2'. " +
            "The only types it can depend on are: ";
         (this.rootDirectory as Directory).modules = this.makeModules({
            "module-1": [ModuleType.CONTRACT, ["module-2"]],
            "module-2": [ModuleType.GROUP, []]
         });
         expect(this.build).toThrowError(ERROR + ModuleType.CONTRACT);

         (this.rootDirectory as Directory).modules = this.makeModules({
            "module-1": [ModuleType.UI, ["module-2"]],
            "module-2": [ModuleType.SERVER, []]
         });
         expect(this.build).toThrowError(ERROR +
            [ModuleType.CONTRACT, ModuleType.UI].join(", "));

         (this.rootDirectory as Directory).modules = this.makeModules({
            "module-1": [ModuleType.SERVER, ["module-2"]],
            "module-2": [ModuleType.UI, []]
         });
         expect(this.build).toThrowError(ERROR +
            [ModuleType.CONTRACT, ModuleType.SERVER].join(", "));
      });
   });

   describe("WHEN it is initialized with null or undefined", () => {
      it("THEN everything goes well", function (): void {
         expect(() => { new ProjectRoot(null); }).not.toThrow();
         expect(() => { new ProjectRoot(undefined); }).not.toThrow();
      });
   });

   describe("#allModulesOfType", () => {
      it("returns the modules of the specified type", function (): void {
         (this.rootDirectory as Directory).modules = this.makeModules({
            "module-1": [ModuleType.SERVER, []],
            "module-2": [ModuleType.UI, []],
            "module-3": [ModuleType.UI, []],
            "module-4": [ModuleType.CONTRACT, []],
            "module-5": [ModuleType.CONTRACT, []],
            "module-6": [ModuleType.GROUP, []]
         });

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

   describe("#getBuildOrder", () => {
      it("returns the modules grouped and ordered correctly", function (): void {
         (this.rootDirectory as Directory).modules = this.makeModules({
            "module-1": [ModuleType.SERVER, ["module-3"]],
            "module-2": [ModuleType.UI, ["module-3", "module-4"]],
            "module-3": [ModuleType.CONTRACT, []],
            "module-4": [ModuleType.UI, ["module-5", "module-6"]],
            "module-5": [ModuleType.CONTRACT, ["module-6"]],
            "module-6": [ModuleType.CONTRACT, []]
         });
         const testObj: ProjectRoot = this.build();
         expect(testObj.getBuildOrder("module-1")).toEqual([["module-3"], ["module-1"]]);
         expect(testObj.getBuildOrder("module-2")).toEqual([
            ["module-6"], ["module-5"], ["module-3", "module-4"], ["module-2"]
         ]);
         expect(testObj.getBuildOrder("module-3")).toEqual([["module-3"]]);
         expect(testObj.getBuildOrder("module-4")).toEqual([
            ["module-6"], ["module-5"], ["module-4"]
         ]);
         expect(testObj.getBuildOrder("module-5")).toEqual([["module-6"], ["module-5"]]);
         expect(testObj.getBuildOrder("module-6")).toEqual([["module-6"]]);
      });
   });
});