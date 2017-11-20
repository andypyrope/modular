import { Dependency } from "../../../main/types/Dependency";

export class DependencyMock implements Dependency {
   static currentId: number = 0;

   constructor(
      public id: string = "module-" + DependencyMock.currentId++) {
   }
}