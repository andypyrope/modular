export enum ModuleType {
   /**
    * Can only consume other contract modules
    * Only exports one or more d.ts files.
    */
   CONTRACT = "contract",

   /**
    * Can only consume UI or contract modules.
    * Exports d.ts, js, properties, html, css
    */
   UI = "ui",

   /**
    * Can only consume contract modules.
    * Only exports js.
    * Should be unique.
    */
   SERVER = "server",

   /**
    * Does not consume anything.
    * Does not export anything.
    * Its only purpose is to have other modules as dependencies to group them together.
    */
   GROUP = "group"
}