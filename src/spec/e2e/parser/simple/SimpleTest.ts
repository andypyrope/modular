import { Parser } from "./../../../../main/Parser";
import { ProjectRoot } from "./../../../../main/types/ProjectRoot";

describe("[E2E] SimpleTest", (): void => {
   describe("WHEN there is a project root with one directory with one module", (): void => {
      it("THEN no error is thrown", function (): void {
         // NOTE alalev: By convention, the XML file should be in the same directory
         // and with the same name.
         const PATH_TO_XML: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         Parser.parseSync(PATH_TO_XML);
      });
   });
});