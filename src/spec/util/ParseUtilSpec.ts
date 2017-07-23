import * as fs from "fs";
import * as xml2js from "xml2js";
import { ProjectRoot } from "./../../main/types/ProjectRoot";
import { XmlObjectBuilder } from "./../../main/util/XmlObjectBuilder";
import { DataAdapter } from "./../../main/util/DataAdapter";
import { RawData } from "./../../main/core/RawData";
import { AdaptedData } from "./../../main/core/AdaptedData";
import { ParseUtil } from "./../../main/util/ParseUtil";
import { AdaptedDataFactory } from "./../mock/AdaptedDataFactory";

describe("ParseUtil", (): void => {
   describe("#readFileSync", (): void => {
      beforeEach(function (): void {
         this.filePath = "./some/file/path";
         this.callReadFileSync = (): string => {
            return ParseUtil.readFileSync(this.filePath);
         };

         this.fileExists = true;
         spyOn(fs, "existsSync").and.callFake(
            (): boolean => { return this.fileExists; }
         );

         this.statResult = {
            isFile: true
         };
         spyOn(fs, "statSync").and.callFake(
            (): any => { return this.statResult; }
         );
      });

      it("returns the contents of the file", function (): void {
         const RESULT: string = "File content";
         spyOn(fs, "readFileSync").and.returnValue(new Buffer(RESULT));
         expect(this.callReadFileSync).not.toThrow();
         expect(this.callReadFileSync()).toBe(RESULT);
      });

      describe("WHEN the file does not exist", (): void => {
         it("THEN it throws the correct error", function (): void {
            this.fileExists = false;
            expect(this.callReadFileSync)
               .toThrowError("The file at path '" + this.filePath + "' does not exist.");
         });
      });

      describe("WHEN the path leads to something that is not a file", (): void => {
         it("THEN it throws the correct error", function (): void {
            this.statResult.isFile = false;
            expect(this.callReadFileSync)
               .toThrowError("'" + this.filePath + "' is not a file.");
         });
      });
   });

   describe("#parseXmlFileContentsSync", (): void => {
      type returnType = { error: Error, result: ProjectRoot };

      beforeEach(function (): void {
         this.contents = "Contents";
         this.parseOptions = {};
         this.callParseXmlFileContentsSync = (): returnType => {
            return ParseUtil.parseXmlFileContentsSync(this.contents, this.parseOptions);
         };

         this.xml2jsContents = null;
         this.xml2jsParseOptions = {};

         this.xml2jsError = null;
         this.xml2jsResult = { ProjectRoot: {} };

         this.spyOnParseString = spyOn(xml2js, "parseString").and.callFake(
            (contents: string, parseOptions: any,
               callback: (error: Error, result: any) => void): void => {
               this.xml2jsContents = contents;
               this.xml2jsParseOptions = parseOptions;
               callback(this.xml2jsError, this.xml2jsResult);
            });

         this.adaptedRoot = new AdaptedDataFactory().build();
         this.adaptCalledWith = null;
         this.spyOnAdapt = spyOn(DataAdapter, "adapt").and.callFake(
            (data: RawData): AdaptedData => {
               this.adaptCalledWith = data;
               return this.adaptedRoot;
            });


         this.instantiateData = null;
         this.instantiateClazz = null;
         this.projectRoot = new ProjectRoot(null);
         this.spyOnInstantiate = spyOn(XmlObjectBuilder, "instantiate").and.callFake(
            (data: AdaptedData, clazz: any): ProjectRoot => {
               this.instantiateData = data;
               this.instantiateClazz = clazz;
               return this.projectRoot;
            });
      });

      it("returns the instantiated ProjectRoot object", function (): void {
         const RESULT: returnType = this.callParseXmlFileContentsSync();
         expect(RESULT.error).toBeNull;
         expect(RESULT.result).toBe(this.projectRoot);

         expect(xml2js.parseString).toHaveBeenCalledTimes(1);
         const PARSE_STRING_ARGS: any[] =
            (this.spyOnParseString as jasmine.Spy).calls.argsFor(0);
         expect(PARSE_STRING_ARGS[0]).toBe(this.contents);
         expect(PARSE_STRING_ARGS[1]).toBe(this.parseOptions);

         expect(DataAdapter.adapt).toHaveBeenCalledTimes(1);
         expect((this.spyOnAdapt as jasmine.Spy).calls.argsFor(0)[0])
            .toBe(this.xml2jsResult["ProjectRoot"]);

         expect(XmlObjectBuilder.instantiate).toHaveBeenCalledTimes(1);
         const INSTANTIATE_ARGS: any[] =
            (this.spyOnInstantiate as jasmine.Spy).calls.argsFor(0);
         expect(INSTANTIATE_ARGS[0]).toBe(this.adaptedRoot);
         expect(INSTANTIATE_ARGS[1]).toBe(ProjectRoot);
      });

      describe("WHEN xml2js returns an error", (): void => {
         it("THEN it immediately returns an object with this error", function (): void {
            this.xml2jsError = new Error("Failed to parse XML");
            const RESULT: returnType = this.callParseXmlFileContentsSync();
            expect(RESULT.error).toBe(this.xml2jsError);
            expect(RESULT.result).toBeNull();

            expect(DataAdapter.adapt).not.toHaveBeenCalled();
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN the root object is not of type ProjectRoot", (): void => {
         it("THEN it returns an appropriate error", function (): void {
            this.xml2jsResult = { SomeOtherObject: {} };
            const RESULT: returnType = this.callParseXmlFileContentsSync();
            expect(RESULT.error).not.toBeNull();
            expect(RESULT.error.message)
               .toBe("The root element is not of type ProjectRoot");
            expect(RESULT.result).toBeNull();

            expect(DataAdapter.adapt).not.toHaveBeenCalled();
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN DataAdapter#adapt throws an error", (): void => {
         it("THEN it returns an object with this error", function (): void {
            const ADAPT_ERROR: string = "adapt error";
            (this.spyOnAdapt as jasmine.Spy).and.throwError(ADAPT_ERROR);
            const RESULT: returnType = this.callParseXmlFileContentsSync();
            expect(RESULT.error).not.toBeNull();
            expect(RESULT.error.message).toBe(ADAPT_ERROR);
            expect(RESULT.result).toBeNull();
            expect(XmlObjectBuilder.instantiate).not.toHaveBeenCalled();
         });
      });

      describe("WHEN XmlObjectBuilder#instantiate throws an error", (): void => {
         it("THEN it returns an object with this error", function (): void {
            const INSTANTIATE_ERROR: string = "instantiate error";
            (this.spyOnInstantiate as jasmine.Spy).and.throwError(INSTANTIATE_ERROR);
            const RESULT: returnType = this.callParseXmlFileContentsSync();
            expect(RESULT.error).not.toBeNull();
            expect(RESULT.error.message).toBe(INSTANTIATE_ERROR);
            expect(RESULT.result).toBeNull();
         });
      });
   });
});