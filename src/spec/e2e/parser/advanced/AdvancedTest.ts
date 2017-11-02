import { Parser } from "./../../../../main/Parser";
import { Module } from "./../../../../main/types/Module";
import { ModuleType } from "./../../../../main/types/ModuleType";
import { ProjectRoot } from "./../../../../main/types/ProjectRoot";
import * as path from "path";

describe("[E2E] AdvancedTest", (): void => {
   describe("WHEN there is a project root with many directories and modules", (): void => {
      it("THEN no error is thrown", function (): void {
         const PATH_TO_XML: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         const PROJECT: ProjectRoot = Parser.parseSync(PATH_TO_XML);

         const someModule: Module = PROJECT.allModulesOfType(ModuleType.UI)[1];
         expect(someModule.id).toBe("module-11");
         expect(someModule.directory)
            .toBe(["someDirectory", "dir1", "module-11"].join(path.sep));
      });
   });
});