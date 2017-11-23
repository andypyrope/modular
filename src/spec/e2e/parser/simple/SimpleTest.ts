import { Parser } from "../../../../main/Parser";
import { ProjectRoot } from "../../../../main/types/ProjectRoot";

interface SS {
}

describe("[E2E] SimpleTest", () => {
   describe("WHEN there is a project root with one directory with one module", () => {
      it("THEN no error is thrown", function (this: SS): void {
         // NOTE alalev: By convention, the XML file should be in the same directory
         // and with the same name.
         const pathToXml: string = __filename
            .replace("dist", "src")
            .replace(/\.js$/, ".xml");

         Parser.parseSync(pathToXml);
      });
   });
});