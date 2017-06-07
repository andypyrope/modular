import { NotEmpty, ValidateNested, IsLowercase, Matches } from "validator.ts/decorator/Validation";
import { Module } from "./Module";
import { ModuleBase } from "./ModuleBase";
import { Dependency } from "./Dependency";

export class PageModule extends ModuleBase implements Module {
}