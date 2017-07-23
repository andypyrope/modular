interface Processors {
  stripPrefix: any;
}

declare module "xml2js" {
  export function parseString(string: string): any;
  export function parseString(string: string, callback: (err: any, result: any) => any): void;
  export function parseString(string: string, options: Object, callback: (err: any, result: any) => any): void;

  export var processors: Processors;
}