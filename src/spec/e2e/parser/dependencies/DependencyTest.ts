import { Parser } from "../../../../main/Parser";
import { ProjectRoot } from "../../../../main/types/ProjectRoot";

describe("[E2E] DependencyTest", (): void => {
   describe("WHEN there are complex dependencies between modules", (): void => {
      it("THEN their dependencies are well-grouped and well-ordered", function (): void {
         const pathToXml: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         const testObj: ProjectRoot = Parser.parseSync(pathToXml);
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
   });
});