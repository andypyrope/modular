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
   beforeEach(function (this: SS): void {
      MockUtil.initialize();
      this.id = "lib-module-name-1";
      this.type = "ui";
      this.parentDir = "";

      let mockedDependencies: DependencyMock[] = [];
      this.addDependencies = (...dependencies: DependencyMock[]): void => {
         mockedDependencies = mockedDependencies.concat(dependencies);
      };

      this.build = (): Module => new ModuleImpl(new AdaptedDataFactory()
         .attr("id", this.id)
         .attr("type", this.type)
         .children("Dependency", MockUtil.registerAll(mockedDependencies))
         .build(), this.parentDir);
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (this: SS): void {
         this.parentDir = "parentDir";
         expect(this.build).not.toThrow();
         expect(this.build().directory)
            .toBe(path.join(this.parentDir, this.id));
      });
   });

   describe("WHEN its ID is not in kebab-case", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.id = "libModuleName";
         expect(this.build).toThrow();
      });
   });

   describe("WHEN its type is valid", () => {
      it("THEN it does not throw an error", function (this: SS): void {
         const tryModuleType: (type: ModuleType) => void = (type: ModuleType): void => {
            this.type = type;
            expect(this.build).not.toThrow();
         };
         tryModuleType(ModuleType.CONTRACT);
         tryModuleType(ModuleType.GROUP);
         tryModuleType(ModuleType.SERVER);
         tryModuleType(ModuleType.UI);
      });
   });

   describe("WHEN its type is not valid", () => {
      it("THEN it throws an error", function (this: SS): void {
         this.type = "asd";
         expect(this.build).toThrow();
      });
   });
});