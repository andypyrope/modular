import { Module } from "./Module";
import { NotEmpty, ValidateNested, IsLowercase, Matches } from "validator.ts/decorator/Validation";
import { ModuleBase } from "./ModuleBase";
import { Dependency } from "./Dependency";

export class LibModule extends ModuleBase implements Module {
}