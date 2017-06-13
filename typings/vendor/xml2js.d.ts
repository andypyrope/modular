interface Processors {
  stripPrefix: any;
}

declare module "xml2js" {
  export function parseString(string: string): any;
  export function parseString(string: string, callback: (err: any, result: any) => any): any;
  export function parseString(string: string, options: Object, callback: (err: any, result: any) => any): any;

  export var processors: Processors;
}