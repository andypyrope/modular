import { Dependency } from "./Dependency";

export interface Module {
   id: string;
   dependencies: Dependency[];
   directory: string;

   setDirectory(directory: string): void;
}