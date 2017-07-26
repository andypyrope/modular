import { Parser } from "./../../../../main/Parser";
import { ProjectRoot } from "./../../../../main/types/ProjectRoot";

describe("[E2E] AdvancedTest", (): void => {
   describe("WHEN there is a project root with many directories and modules", (): void => {
      it("THEN no error is thrown", function (): void {
         const PATH_TO_XML: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         expect((): ProjectRoot => { return Parser.parseSync(PATH_TO_XML); })
            .not.toThrow();
      });
   });
});