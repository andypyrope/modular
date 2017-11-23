import { ProjectRoot } from "../main/types/ProjectRoot";
import { ParseUtil } from "../main/util/ParseUtil";
import { Parser } from "../main/Parser";
import { ProjectRootMock } from "./mock/types/ProjectRootMock";
import { ParseResult } from "../main/ParseResult";

interface SS {
   xmlPath: string;
   fileContents: string;
   spyOnReadFileSync: jasmine.Spy;
   parseError?: Error;
   parseResult?: ProjectRoot;
   spyOnParse: jasmine.Spy;
   callParseSync(): ProjectRoot | undefined;
}

describe("Parser", () => {
   describe("#parseSync", () => {
      beforeEach(function (this: SS): void {
         this.xmlPath = "./xml/path/xmlFile.xml";

         this.callParseSync = (): ProjectRoot | undefined => {
            return Parser.parseSync(this.xmlPath);
         };

         this.fileContents = "<ProjectRoot>asd</ProjectRoot>";
         this.spyOnReadFileSync = spyOn(ParseUtil, "readFileSync")
            .and.returnValue(this.fileContents);


         this.parseError = undefined;
         this.parseResult = new ProjectRootMock();

         this.spyOnParse = spyOn(ParseUtil, "parseXmlFileContentsSync")
            .and.callFake((): ParseResult => {
               return {
                  error: this.parseError,
                  result: this.parseResult
               };
            });
      });

      it("returns the result", function (this: SS): void {
         expect(this.callParseSync).not.toThrow();
         expect(this.callParseSync()).toBe(this.parseResult);

         const parseXmlArgs: any[] = this.spyOnParse.calls.argsFor(0);
         expect(parseXmlArgs[0]).toBe(this.fileContents);
         expect(parseXmlArgs[1]).toBeDefined();
      });

      describe("WHEN ParseUtil throws while reading the file", () => {
         it("THEN it rethrows the error", function (this: SS): void {
            const readError: string = "Could not read the file";
            this.spyOnReadFileSync.and.throwError(readError);
            expect(this.callParseSync).toThrowError(readError);
         });
      });

      describe("WHEN ParseUtil throws while parsing the file", () => {
         it("THEN it rethrows the error", function (this: SS): void {
            const parseError: string = "Could not parse the file";
            this.spyOnParse.and.throwError(parseError);
            expect(this.callParseSync).toThrowError(parseError);
         });
      });

      describe("WHEN ParseUtil returns an error while parsing", () => {
         it("THEN it rethrows the error", function (this: SS): void {
            this.parseError = new Error("Caught an error while parsing");
            expect(this.callParseSync).toThrow(this.parseError);
         });
      });

      describe("WHEN ParseUtil returns neither an error nor a result", () => {
         it("THEN it throws an error", function (this: SS): void {
            this.parseResult = undefined;
            expect(this.callParseSync).toThrowError("No result and no error");
         });
      });
   });
});