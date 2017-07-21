import { MockUtil } from "./../mock/MockUtil";
import { Directory } from "./../../main/types/Directory";
import { ProjectRoot } from "./../../main/types/ProjectRoot";
import { AdaptedDataFactory } from "./../mock/AdaptedDataFactory";
import { AdaptedData } from "./../../main/core/AdaptedData";

describe("ProjectRoot", () => {
   beforeEach(function (): void {
      MockUtil.initialize();
      this.rootDirectory = new Directory(null);
      this.webpackFile = "wp-config.json";
      this.tsFolder = "ts";
      this.stylesFolder = "styles";

      this.build = (): ProjectRoot => {
         const DATA: AdaptedData = new AdaptedDataFactory()
            .attr("webpackFile", this.webpackFile)
            .attr("tsFolder", this.tsFolder)
            .attr("stylesFolder", this.stylesFolder)
            .children("Directory", MockUtil.registerAll([this.rootDirectory]))
            .build();
         return new ProjectRoot(DATA);
      };
   });

   describe("WHEN it is initialized with valid data", () => {
      it("THEN everything goes well", function (): void {
         let testObj: ProjectRoot = this.build();

         expect(testObj.webpackFile).toBe(this.webpackFile);
         expect(testObj.tsFolder).toBe(this.tsFolder);
         expect(testObj.stylesFolder).toBe(this.stylesFolder);

         expect(testObj.rootDirectory).toBe(this.rootDirectory);
      });
   });

   describe("WHEN it is initialized with null or undefined", () => {
      it("THEN everything goes well", function (): void {
         expect(() => { new ProjectRoot(null); }).not.toThrow();
         expect(() => { new ProjectRoot(undefined); }).not.toThrow();
      });
   });
});