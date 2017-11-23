import { Parser } from "../../../../main/Parser";
import { Module } from "../../../../main/types/Module";
import { ModuleType } from "../../../../main/ModuleType";
import { ProjectRoot } from "../../../../main/types/ProjectRoot";
import * as path from "path";

interface SS {
}

describe("[E2E] AdvancedTest", () => {
   describe("WHEN there is a project root with many directories and modules", () => {
      it("THEN no error is thrown", function (this: SS): void {
         const pathToXml: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         const project: ProjectRoot = Parser.parseSync(pathToXml);

         const someModule: Module = project.allModulesOfType(ModuleType.UI)[1];
         expect(someModule.id).toBe("module-11");
         expect(someModule.directory)
            .toBe(["someDirectory", "dir1", "module-11"].join(path.sep));
      });
   });
});