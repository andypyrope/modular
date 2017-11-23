import { Parser } from "../../../../main/Parser";
import { ProjectRoot } from "../../../../main/types/ProjectRoot";

interface SS {
}

describe("[E2E] DuplicateModuleIdsTest", () => {
   describe("WHEN there are two modules with the same ID", () => {
      it("THEN an error is thrown", function (this: SS): void {
         const pathToXml: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         const expectedErrorMessage: string = "There is more than one module with " +
            "ID 'duplicate-id' in directory 'someDirectory'";

         expect((): ProjectRoot => { return Parser.parseSync(pathToXml); })
            .toThrowError(expectedErrorMessage);
      });
   });
});