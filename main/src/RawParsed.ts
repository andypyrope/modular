export interface RawParsedObject {
   $?: { [attributeName: string]: string };
   _?: string;
   $$?: { [childType: string]: RawParsedObject[] };
};

export type RawParsed = RawParsedObject | string;