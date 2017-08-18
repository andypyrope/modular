import { Parser } from "./../../../../main/Parser";
import { ProjectRoot } from "./../../../../main/types/ProjectRoot";

describe("[E2E] DuplicateModuleIdsTest", (): void => {
   describe("WHEN there are two modules with the same ID", (): void => {
      it("THEN an error is thrown", function (): void {
         const PATH_TO_XML: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         expect((): ProjectRoot => { return Parser.parseSync(PATH_TO_XML); })
            .toThrowError("There is more than one module with ID 'duplicate-id'");
      });
   });
});