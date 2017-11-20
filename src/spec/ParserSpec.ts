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

describe("Parser", (): void => {
   describe("#parseSync", (): void => {
      beforeEach(function (): void {
         (this as SS).xmlPath = "./xml/path/xmlFile.xml";

         (this as SS).callParseSync = (): ProjectRoot | undefined => {
            return Parser.parseSync((this as SS).xmlPath);
         };

         (this as SS).fileContents = "<ProjectRoot>asd</ProjectRoot>";
         (this as SS).spyOnReadFileSync = spyOn(ParseUtil, "readFileSync")
            .and.returnValue((this as SS).fileContents);


         (this as SS).parseError = undefined;
         (this as SS).parseResult = new ProjectRootMock();

         (this as SS).spyOnParse = spyOn(ParseUtil, "parseXmlFileContentsSync")
            .and.callFake((): ParseResult => {
               return {
                  error: (this as SS).parseError,
                  result: (this as SS).parseResult
               };
            });
      });

      it("returns the result", function (): void {
         expect((this as SS).callParseSync).not.toThrow();
         expect((this as SS).callParseSync()).toBe((this as SS).parseResult);

         const parseXmlArgs: any[] = (this as SS).spyOnParse.calls.argsFor(0);
         expect(parseXmlArgs[0]).toBe((this as SS).fileContents);
         expect(parseXmlArgs[1]).toBeDefined();
      });

      describe("WHEN ParseUtil throws while reading the file", (): void => {
         it("THEN it rethrows the error", function (): void {
            const readError: string = "Could not read the file";
            (this as SS).spyOnReadFileSync.and.throwError(readError);
            expect((this as SS).callParseSync).toThrowError(readError);
         });
      });

      describe("WHEN ParseUtil throws while parsing the file", (): void => {
         it("THEN it rethrows the error", function (): void {
            const parseError: string = "Could not parse the file";
            (this as SS).spyOnParse.and.throwError(parseError);
            expect((this as SS).callParseSync).toThrowError(parseError);
         });
      });

      describe("WHEN ParseUtil returns an error while parsing", (): void => {
         it("THEN it rethrows the error", function (): void {
            const PARSE_ERROR: string = "Caught an error while parsing";
            (this as SS).parseError = new Error(PARSE_ERROR);
            expect((this as SS).callParseSync).toThrowError(PARSE_ERROR);
         });
      });

      describe("WHEN ParseUtil returns neither an error nor a result", (): void => {
         it("THEN it throws an error", function (): void {
            (this as SS).parseResult = undefined;
            expect((this as SS).callParseSync).toThrowError("No result and no error");
         });
      });
   });
});