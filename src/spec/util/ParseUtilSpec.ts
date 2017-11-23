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

describe("ParseUtil", () => {
   beforeEach(function (this: SS): void {
      this.parseOptions = {};
      this.callParseXmlFileContentsSync = (): ParseResult =>
         ParseUtil.parseXmlFileContentsSync(this.contents,
            this.parseOptions);
   });

   describe("#readFileSync", () => {
      beforeEach(function (this: SS): void {
         this.filePath = "./some/file/path";
         this.callReadFileSync = (): string =>
            ParseUtil.readFileSync(this.filePath);

         this.fileExists = true;
         spyOn(fs, "existsSync").and.callFake(
            (): boolean => { return this.fileExists; }
         );


         this.statResult = {
            isFile: true
         };
         spyOn(fs, "statSync").and.callFake((): StatResult => this.statResult);
      });

      it("returns the contents of the file", function (this: SS): void {
         const result: string = "File content";
         spyOn(fs, "readFileSync").and.returnValue(new Buffer(result));
         expect(this.callReadFileSync).not.toThrow();
         expect(this.callReadFileSync()).toBe(result);
      });

      describe("WHEN the file does not exist", () => {
         it("THEN it throws the correct error", function (this: SS): void {
            this.fileExists = false;
            expect(this.callReadFileSync)
               .toThrowError("The file at path '" + this.filePath + "' does not exist.");
         });
      });

      describe("WHEN the path leads to something that is not a file", () => {
         it("THEN it throws the correct error", function (this: SS): void {
            this.statResult.isFile = false;
            expect(this.callReadFileSync)
               .toThrowError("'" + this.filePath + "' is not a file.");
         });
      });
   });

   describe("#parseXmlFileContentsSync", () => {
      beforeEach(function (this: SS): void {
         this.contents = "Contents";

         this.xml2jsContents = undefined;
         this.xml2jsParseOptions = {};

         this.xml2jsError = undefined;
         this.xml2jsResult = { ProjectRoot: {} };

         this.spyOnParseString = spyOn(xml2js, "parseString").and.callFake(
            (contents: string, parseOptions: any,
               callback: (error?: Error, result?: any) => void): void => {
               this.xml2jsContents = contents;
               this.xml2jsParseOptions = parseOptions;
               callback(this.xml2jsError, this.xml2jsResult);
            });

         this.adaptedRoot = new AdaptedDataFactory().build();
         this.adaptCalledWith = undefined;
         this.spyOnAdapt = spyOn(DataAdapter, "adapt").and.callFake(
            (data: RawData): AdaptedData => {
               this.adaptCalledWith = data;
               return this.adaptedRoot;
            });


         this.instantiateData = undefined;
         this.instantiateClazz = undefined;
         this.projectRoot = new ProjectRootMock();
         this.spyOnInstantiate = spyOn(XmlObjectBuilder, "instantiate")
            .and.callFake((data: AdaptedData, clazz: XmlObjectClass<ProjectRoot, void>):
               ProjectRoot => {
               this.instantiateData = data;
               this.instantiateClazz = clazz;
               return this.projectRoot;
            });

         this.verifyParse = (expectedError?: string): void => {
            const result: ParseResult = this.callParseXmlFileContentsSync();
            if (expectedError) {
               expect(result.error).toBeDefined();
               expect(result.result).not.toBeDefined();
               const actualError: string = result.error ? result.error.message : "";
               expect(actualError).toBe(expectedError);
            } else {
               expect(result.error).not.toBeDefined();
               expect(result.result).toBe(this.projectRoot);
            }
         };
      });

      it("returns the instantiated ProjectRoot object", function (this: SS): void {
         this.verifyParse();

         expect(xml2js.parseString).toHaveBeenCalledTimes(1);
         const parseStringArgs: any[] =
            (this.spyOnParseString as jasmine.Spy).calls.argsFor(0);
         expect(parseStringArgs[0]).toBe(this.contents);
         expect(parseStringArgs[1]).toBe(this.parseOptions);

         expect(DataAdapter.adapt).toHaveBeenCalledTimes(1);
         expect((this.spyOnAdapt as jasmine.Spy).calls.argsFor(0)[0])
            .toBe(this.xml2jsResult["ProjectRoot"]);

         expect(XmlObjectBuilder.instantiate).toHaveBeenCalledTimes(1);
         const instantiateArgs: any[] =
            (this.spyOnInstantiate as jasmine.Spy).calls.argsFor(0);
         expect(instantiateArgs[0]).toBe(this.adaptedRoot);
         expect(instantiateArgs[1]).toBe(ProjectRootImpl);
      });

      describe("WHEN xml2js returns an error", () => {
         it("THEN it immediately returns an object with this error", function (this: SS): void {
            this.xml2jsError = new Error("Failed to parse XML");
            this.verifyParse("Failed to parse XML");
            expect(DataAdapter.adapt).not.toHaveBeenCalled();
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN the root object is not of type ProjectRoot", () => {
         it("THEN it returns an appropriate error", function (this: SS): void {
            this.xml2jsResult = { SomeOtherObject: {} };
            this.verifyParse("The root element is not of type ProjectRoot");
            expect(DataAdapter.adapt).not.toHaveBeenCalled();
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN DataAdapter#adapt throws an error", () => {
         it("THEN it returns an object with this error", function (this: SS): void {
            const adaptError: string = "adapt error";
            this.spyOnAdapt.and.throwError(adaptError);
            this.verifyParse(adaptError);
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN XmlObjectBuilder#instantiate throws an error", () => {
         it("THEN it returns an object with this error", function (this: SS): void {
            const instantiateError: string = "instantiate error";
            this.spyOnInstantiate.and.throwError(instantiateError);
            this.verifyParse(instantiateError);
         });
      });
   });
});