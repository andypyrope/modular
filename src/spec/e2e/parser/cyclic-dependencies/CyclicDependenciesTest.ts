import { Parser } from "../../../../main/Parser";
import { ProjectRoot } from "../../../../main/types/ProjectRoot";

interface SS {
}

describe("[E2E] CyclicDependenciesTest", () => {
   describe("WHEN there is a cyclic dependency", () => {
      it("THEN an error is thrown", function (this: SS): void {
         const pathToXml: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         const expectedErrorMessage: string = "There is the following cyclic " +
            "dependency: module-1 -> module-2 -> module-3 -> module-1";

         expect((): ProjectRoot => { return Parser.parseSync(pathToXml); })
            .toThrowError(expectedErrorMessage);
      });
   });
});