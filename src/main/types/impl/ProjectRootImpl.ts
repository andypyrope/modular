import { ProjectRoot } from "../ProjectRoot";
import { DirectoryImpl } from "./DirectoryImpl";
import { Directory } from "../Directory";
import { ModuleImpl } from "./ModuleImpl";
import { Module } from "../Module";
import { XmlObjectBase } from "./base/XmlObjectBase";
import { NotEmptyAssertion } from "../../assertions/NotEmptyAssertion";
import { ModuleType } from "../../ModuleType";
import { CyclicDependencyError } from "../../err/CyclicDependencyError";
import { InvalidDependencyTypeError } from "../../err/InvalidDependencyTypeError";
import { DependencyDoesNotExistError } from "../../err/DependencyDoesNotExistError";
import { Queue } from "../../util/Queue";
import { AdaptedData } from "../../core/AdaptedData";

export class ProjectRootImpl extends XmlObjectBase implements ProjectRoot {
   readonly rootDirectory: Directory;
   readonly modules: { [id: string]: Module };

   private ALLOWED_DEPENDENCIES: { [from: string]: ModuleType[] };

   constructor(data: AdaptedData) {
      super(data);

      this.ALLOWED_DEPENDENCIES = {};
      this.ALLOWED_DEPENDENCIES[ModuleType.UI] = [ModuleType.CONTRACT, ModuleType.UI];
      this.ALLOWED_DEPENDENCIES[ModuleType.CONTRACT] = [ModuleType.CONTRACT];
      this.ALLOWED_DEPENDENCIES[ModuleType.SERVER] = [
         ModuleType.CONTRACT, ModuleType.SERVER
      ];
      this.ALLOWED_DEPENDENCIES[ModuleType.GROUP] = [
         ModuleType.CONTRACT, ModuleType.SERVER, ModuleType.UI, ModuleType.GROUP
      ];

      this.rootDirectory = this.instantiateChildWithData<Directory, string>(
         DirectoryImpl, "");

      this.modules = this.rootDirectory.modules;
      for (let id in this.modules) {
         this.verifyDependencies(this.modules[id], [id]);
      }
   }

   allModulesOfType(type: ModuleType): Module[] {
      const result: Module[] = [];
      for (let moduleId in this.modules) {
         if (this.modules[moduleId].type === type) {
            result.push(this.modules[moduleId]);
         }
      }
      return result;
   }

   getDependentModuleIds(module: Module | string): string[] {
      const moduleId: string = this.toModuleId(module);
      const result: string[] = [];

      for (const potentiallyDependentId in this.modules) {
         if (this.modules[potentiallyDependentId].dependsOn(moduleId)) {
            result.push(potentiallyDependentId);
         }
      }

      return result;
   }

   getBuildOrder(sourceModule: Module | string): (string | string[])[] {
      const moduleId: string = this.toModuleId(sourceModule);

      const allModules: { [id: string]: Module } = {};
      const visited: { [moduleId: string]: true } = {};
      const inDegree: { [moduleId: string]: number } = {};
      const queue: Queue<Module> = new Queue();

      queue.push(this.modules[moduleId]);
      visited[moduleId] = true;
      inDegree[moduleId] = 0;

      while (!queue.empty()) {
         const currentModule: Module = queue.pop();
         allModules[currentModule.id] = currentModule;
         for (let dependency of currentModule.dependencies) {
            if (!visited[dependency.id]) {
               visited[dependency.id] = true;
               inDegree[dependency.id] = 0;
               queue.push(this.modules[dependency.id]);
            }
            ++inDegree[dependency.id];
         }
      }

      let currentModulesWithZeroDegree: string[];
      let nextModulesWithZeroDegree: string[] = [moduleId];
      const result: string[][] = [];

      while (nextModulesWithZeroDegree.length) {
         currentModulesWithZeroDegree = nextModulesWithZeroDegree;
         nextModulesWithZeroDegree = [];
         result.push(currentModulesWithZeroDegree);

         for (let moduleId of currentModulesWithZeroDegree) {
            for (let dependency of this.modules[moduleId].dependencies) {
               --inDegree[dependency.id];
               if (inDegree[dependency.id] === 0) {
                  nextModulesWithZeroDegree.push(dependency.id);
               }
            }
         }
      }

      const simplifiedResult: (string | string[])[] = [];
      for (const moduleGroup of result) {
         simplifiedResult.push(moduleGroup.length === 1 ? moduleGroup[0] : moduleGroup);
      }

      return simplifiedResult.reverse();
   }

   private toModuleId(module: Module | string): string {
      const moduleId: string = (typeof module === "string")
         ? module
         : module.id;

      if (!this.modules[moduleId]) {
         throw new Error("Module '" + moduleId + "' does not exist");
      }

      return moduleId;
   }

   private verifyDependencies(currentModule: Module, visited: string[]): void {
      for (let dependency of currentModule.dependencies) {
         if (!this.modules[dependency.id]) {
            throw new DependencyDoesNotExistError(currentModule.id, dependency.id);
         }
         if (visited.indexOf(dependency.id) > -1) {
            throw new CyclicDependencyError(visited
               .slice(visited.lastIndexOf(dependency.id))
               .concat([dependency.id]));
         }
         if (this.ALLOWED_DEPENDENCIES[currentModule.type]
            .indexOf(this.modules[dependency.id].type) === -1) {
            throw new InvalidDependencyTypeError(currentModule.id, dependency.id,
               this.ALLOWED_DEPENDENCIES[currentModule.type]);
         }
         visited.push(dependency.id);
         this.verifyDependencies(this.modules[dependency.id], visited);
         visited.pop();
      }
   }
}