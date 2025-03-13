import type specs from '@asyncapi/specs';

export type SpecVersions = keyof typeof specs.schemas;

export interface DocumentInfo  {
    title? : string,
    version? : string,
    description? : string,
    numServers? : number,
    numChannels? : number,
    numOperations? : number,
    numMessages?: number
}