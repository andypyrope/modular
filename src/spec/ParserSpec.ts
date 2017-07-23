import { ProjectRoot } from "./../main/types/ProjectRoot";
import { ParseUtil } from "./../main/util/ParseUtil";
import { Parser } from "./../main/Parser";


describe("Parser", (): void => {
   describe("#parseSync", (): void => {
      beforeEach(function (): void {
         this.xmlPath = "./xml/path/xmlFile.xml";

         this.callParseSync = (): ProjectRoot => {
            return Parser.parseSync(this.xmlPath);
         };

         this.fileContents = "<ProjectRoot>asd</ProjectRoot>";
         this.spyOnReadFileSync = spyOn(ParseUtil, "readFileSync")
            .and.returnValue(this.fileContents);


         this.parseError = null;
         this.parseResult = new ProjectRoot(null);

         this.spyOnParse = spyOn(ParseUtil, "parseXmlFileContentsSync").and.callFake(
            (): { error: Error, result: ProjectRoot } => {
               return {
                  error: this.parseError,
                  result: this.parseResult
               };
            }
         );
      });

      it("returns the result", function (): void {
         expect(this.callParseSync).not.toThrow();
         expect(this.callParseSync()).toBe(this.parseResult);
      });

      describe("WHEN ParseUtil throws while reading the file", (): void => {
         it("THEN it rethrows the error", function (): void {
            const READ_ERROR: string = "Could not read the file";
            (this.spyOnReadFileSync as jasmine.Spy).and.throwError(READ_ERROR);
            expect(this.callParseSync).toThrowError(READ_ERROR);
         });
      });


      describe("WHEN ParseUtil throws while parsing the file", (): void => {
         it("THEN it rethrows the error", function (): void {
            const PARSE_ERROR: string = "Could not parse the file";
            this.spyOnParse.and.throwError(PARSE_ERROR);
            expect(this.callParseSync).toThrowError(PARSE_ERROR);
         });
      });

      describe("WHEN ParseUtil returns an error while parsing", (): void => {
         it("THEN it rethrows the error", function (): void {
            const PARSE_ERROR: string = "Caught an error while parsing";
            this.parseError = new Error(PARSE_ERROR);
            expect(this.callParseSync).toThrowError(PARSE_ERROR);
         });
      });
   });
});