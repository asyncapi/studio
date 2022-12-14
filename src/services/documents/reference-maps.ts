import type { SpecTypesV2 } from '@asyncapi/parser/cjs';

interface ReferenceMap extends Record<string | symbol, keyof SpecTypesV2.ComponentsObject | ReferenceMap> {}

export const AllSymbol = Symbol('studio:references:all');
export const DeepAllSymbol = Symbol('studio:references:deep-all');

export const referencesMap: ReferenceMap = {
  'servers': {
    [AllSymbol]: {
      '$ref': 'servers',
      'variables': {
        [AllSymbol]: {
          '$ref': 'serverVariables',
        },
      },
      'bindings': {
        '$ref': 'serverBindings',
      },
    }
  },

  'channels': {
    [AllSymbol]: {
      '$ref': 'channels',
      'parameters': {
        [AllSymbol]: {
          '$ref': 'parameters',
        },
      },
      'bindings': {
        '$ref': 'channelBindings',
      },

      'publish': {
        'message': {
          '$ref': 'messages',
        },
        'bindings': {
          '$ref': 'operationBindings',
        },
        'traits': {
          [AllSymbol]: {
            '$ref': 'operationTraits',
          },
        }
      },
      'subscribe': {
        
      }
    }
  }
};


//   // operations
//   '/channels/*/bindings': 'channelBindings',

//   // schemas

//   // components
//   '/components/servers/*': 'servers',
//   '/components/channels/*': 'channels',
//   '/components/messages/*': 'messages',
//   '/components/schemas/*/**': 'schemas',
//   '/components/serverVariables/*': 'serverVariables',
//   '/components/parameters/*': 'parameters',
//   '/components/securitySchemes/*': 'securitySchemes',
//   '/components/correlationIds/*': 'correlationIds',
//   '/components/operationTraits/*': 'operationTraits',
//   '/components/messageTraits/*': 'messageTraits',
//   '/components/serverBindings/*': 'serverBindings',
//   '/components/channelBindings/*': 'channelBindings',
//   '/components/operationBindings/*': 'operationBindings',
//   '/components/messageBindings/*': 'messageBindings',
// }