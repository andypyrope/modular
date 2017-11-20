import * as fs from "fs";
import * as xml2js from "xml2js";
import { ProjectRoot } from "../../main/types/ProjectRoot";
import { XmlObjectBuilder } from "../../main/util/XmlObjectBuilder";
import { DataAdapter } from "../../main/util/DataAdapter";
import { RawData } from "../../main/core/RawData";
import { AdaptedData } from "../../main/core/AdaptedData";
import { ParseUtil } from "../../main/util/ParseUtil";
import { AdaptedDataFactory } from "../mock/AdaptedDataFactory";
import { ParseResult } from "../../main/ParseResult";
import { XmlObjectClass } from "../../main/core/XmlObjectClass";
import { ProjectRootMock } from "../mock/types/ProjectRootMock";
import { ProjectRootImpl } from "../../main/types/impl/ProjectRootImpl";

interface StatResult {
   isFile: boolean;
}

interface SS {
   filePath: string;
   fileExists: boolean;
   contents: string;
   parseOptions: object;
   statResult: StatResult;
   spyOnParseString: jasmine.Spy;
   callReadFileSync(): string;
   callParseXmlFileContentsSync(): ParseResult;
   verifyParse(errorMessage?: string): void;

   xml2jsContents?: string;
   xml2jsParseOptions: object;
   xml2jsError?: Error;
   xml2jsResult: { ProjectRoot?: object, SomeOtherObject?: object };
   adaptedRoot: AdaptedData;
   adaptCalledWith?: RawData;
   spyOnAdapt: jasmine.Spy;
   instantiateData?: AdaptedData;
   instantiateClazz?: XmlObjectClass<ProjectRoot, void>;
   projectRoot: ProjectRoot;
   spyOnInstantiate: jasmine.Spy;
}

describe("ParseUtil", (): void => {
   beforeEach(function (): void {
      (this as SS).parseOptions = {};
      (this as SS).callParseXmlFileContentsSync = (): ParseResult =>
         ParseUtil.parseXmlFileContentsSync((this as SS).contents,
            (this as SS).parseOptions);
   });

   describe("#readFileSync", (): void => {
      beforeEach(function (): void {
         (this as SS).filePath = "./some/file/path";
         (this as SS).callReadFileSync = (): string =>
            ParseUtil.readFileSync((this as SS).filePath);

         (this as SS).fileExists = true;
         spyOn(fs, "existsSync").and.callFake(
            (): boolean => { return (this as SS).fileExists; }
         );


         (this as SS).statResult = {
            isFile: true
         };
         spyOn(fs, "statSync").and.callFake((): StatResult => (this as SS).statResult);
      });

      it("returns the contents of the file", function (): void {
         const result: string = "File content";
         spyOn(fs, "readFileSync").and.returnValue(new Buffer(result));
         expect((this as SS).callReadFileSync).not.toThrow();
         expect((this as SS).callReadFileSync()).toBe(result);
      });

      describe("WHEN the file does not exist", (): void => {
         it("THEN it throws the correct error", function (): void {
            (this as SS).fileExists = false;
            expect((this as SS).callReadFileSync)
               .toThrowError("The file at path '" + (this as SS).filePath + "' does not exist.");
         });
      });

      describe("WHEN the path leads to something that is not a file", (): void => {
         it("THEN it throws the correct error", function (): void {
            (this as SS).statResult.isFile = false;
            expect((this as SS).callReadFileSync)
               .toThrowError("'" + (this as SS).filePath + "' is not a file.");
         });
      });
   });

   describe("#parseXmlFileContentsSync", (): void => {
      beforeEach(function (): void {
         (this as SS).contents = "Contents";

         (this as SS).xml2jsContents = undefined;
         (this as SS).xml2jsParseOptions = {};

         (this as SS).xml2jsError = undefined;
         (this as SS).xml2jsResult = { ProjectRoot: {} };

         (this as SS).spyOnParseString = spyOn(xml2js, "parseString").and.callFake(
            (contents: string, parseOptions: any,
               callback: (error?: Error, result?: any) => void): void => {
               (this as SS).xml2jsContents = contents;
               (this as SS).xml2jsParseOptions = parseOptions;
               callback((this as SS).xml2jsError, (this as SS).xml2jsResult);
            });

         (this as SS).adaptedRoot = new AdaptedDataFactory().build();
         (this as SS).adaptCalledWith = undefined;
         (this as SS).spyOnAdapt = spyOn(DataAdapter, "adapt").and.callFake(
            (data: RawData): AdaptedData => {
               (this as SS).adaptCalledWith = data;
               return (this as SS).adaptedRoot;
            });


         (this as SS).instantiateData = undefined;
         (this as SS).instantiateClazz = undefined;
         (this as SS).projectRoot = new ProjectRootMock();
         (this as SS).spyOnInstantiate = spyOn(XmlObjectBuilder, "instantiate")
            .and.callFake((data: AdaptedData, clazz: XmlObjectClass<ProjectRoot, void>):
               ProjectRoot => {
               (this as SS).instantiateData = data;
               (this as SS).instantiateClazz = clazz;
               return (this as SS).projectRoot;
            });

         (this as SS).verifyParse = (expectedError?: string): void => {
            const result: ParseResult = (this as SS).callParseXmlFileContentsSync();
            if (expectedError) {
               expect(result.error).toBeDefined();
               expect(result.result).not.toBeDefined();
               const actualError: string = result.error ? result.error.message : "";
               expect(actualError).toBe(expectedError);
            } else {
               expect(result.error).not.toBeDefined();
               expect(result.result).toBe((this as SS).projectRoot);
            }
         };
      });

      it("returns the instantiated ProjectRoot object", function (): void {
         (this as SS).verifyParse();

         expect(xml2js.parseString).toHaveBeenCalledTimes(1);
         const parseStringArgs: any[] =
            ((this as SS).spyOnParseString as jasmine.Spy).calls.argsFor(0);
         expect(parseStringArgs[0]).toBe((this as SS).contents);
         expect(parseStringArgs[1]).toBe((this as SS).parseOptions);

         expect(DataAdapter.adapt).toHaveBeenCalledTimes(1);
         expect(((this as SS).spyOnAdapt as jasmine.Spy).calls.argsFor(0)[0])
            .toBe((this as SS).xml2jsResult["ProjectRoot"]);

         expect(XmlObjectBuilder.instantiate).toHaveBeenCalledTimes(1);
         const instantiateArgs: any[] =
            ((this as SS).spyOnInstantiate as jasmine.Spy).calls.argsFor(0);
         expect(instantiateArgs[0]).toBe((this as SS).adaptedRoot);
         expect(instantiateArgs[1]).toBe(ProjectRootImpl);
      });

      describe("WHEN xml2js returns an error", (): void => {
         it("THEN it immediately returns an object with this error", function (): void {
            (this as SS).xml2jsError = new Error("Failed to parse XML");
            (this as SS).verifyParse("Failed to parse XML");
            expect(DataAdapter.adapt).not.toHaveBeenCalled();
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN the root object is not of type ProjectRoot", (): void => {
         it("THEN it returns an appropriate error", function (): void {
            (this as SS).xml2jsResult = { SomeOtherObject: {} };
            (this as SS).verifyParse("The root element is not of type ProjectRoot");
            expect(DataAdapter.adapt).not.toHaveBeenCalled();
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN DataAdapter#adapt throws an error", (): void => {
         it("THEN it returns an object with this error", function (): void {
            const adaptError: string = "adapt error";
            (this as SS).spyOnAdapt.and.throwError(adaptError);
            (this as SS).verifyParse(adaptError);
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN XmlObjectBuilder#instantiate throws an error", (): void => {
         it("THEN it returns an object with this error", function (): void {
            const instantiateError: string = "instantiate error";
            (this as SS).spyOnInstantiate.and.throwError(instantiateError);
            (this as SS).verifyParse(instantiateError);
         });
      });
   });
});