import { Parser } from "./../../../../main/Parser";
import { ProjectRoot } from "./../../../../main/types/ProjectRoot";

describe("[E2E] CyclicDependenciesTest", (): void => {
   describe("WHEN there is a cyclic dependency", (): void => {
      it("THEN an error is thrown", function (): void {
         const PATH_TO_XML: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         const EXPECTED_ERROR_MESSAGE: string = "There is the following cyclic " +
            "dependency: module-1 -> module-2 -> module-3 -> module-1";

         expect((): ProjectRoot => { return Parser.parseSync(PATH_TO_XML); })
            .toThrowError(EXPECTED_ERROR_MESSAGE);
      });
   });
});