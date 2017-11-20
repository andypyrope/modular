import { MockUtil } from "../mock/MockUtil";
import { Module } from "../../main/types/Module";
import { Dependency } from "../../main/types/Dependency";
import { AdaptedDataFactory } from "../mock/AdaptedDataFactory";
import { AdaptedData } from "../../main/core/AdaptedData";
import * as path from "path";
import { DependencyMock } from "../mock/types/DependencyMock";
import { ModuleImpl } from "../../main/types/impl/ModuleImpl";
import { ModuleType } from "../../main/ModuleType";

interface SS {
   id: string;
   type: string;
   parentDir: string;
   addDependencies(...dependencies: DependencyMock[]): void;
   build(): Module;
}

describe("Module", () => {
   beforeEach(function (): void {
      MockUtil.initialize();
      (this as SS).id = "lib-module-name-1";
      (this as SS).type = "ui";
      (this as SS).parentDir = "";

      let mockedDependencies: DependencyMock[] = [];
      (this as SS).addDependencies = (...dependencies: DependencyMock[]): void => {
         mockedDependencies = mockedDependencies.concat(dependencies);
      };

      (this as SS).build = (): Module => new ModuleImpl(new AdaptedDataFactory()
         .attr("id", (this as SS).id)
         .attr("type", (this as SS).type)
         .children("Dependency", MockUtil.registerAll(mockedDependencies))
         .build(), (this as SS).parentDir);
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (): void {
         (this as SS).parentDir = "parentDir";
         expect((this as SS).build).not.toThrow();
         expect((this as SS).build().directory)
            .toBe(path.join((this as SS).parentDir, (this as SS).id));
      });
   });

   describe("WHEN its ID is not in kebab-case", () => {
      it("THEN it throws an error", function (): void {
         (this as SS).id = "libModuleName";
         expect((this as SS).build).toThrow();
      });
   });

   describe("WHEN its type is valid", () => {
      it("THEN it does not throw an error", function (): void {
         const tryModuleType: (type: ModuleType) => void = (type: ModuleType): void => {
            (this as SS).type = type;
            expect((this as SS).build).not.toThrow();
         };
         tryModuleType(ModuleType.CONTRACT);
         tryModuleType(ModuleType.GROUP);
         tryModuleType(ModuleType.SERVER);
         tryModuleType(ModuleType.UI);
      });
   });

   describe("WHEN its type is not valid", () => {
      it("THEN it throws an error", function (): void {
         this.type = "asd";
         expect((this as SS).build).toThrow();
      });
   });
});