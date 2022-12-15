import { Range, languages } from 'monaco-editor/esm/vs/editor/editor.api';

// @ts-ignore
import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures';
// @ts-ignore
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel';
// @ts-ignore
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices';

import type { SpecTypesV2 } from '@asyncapi/parser/cjs';
import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

interface ReferenceMap extends Record<string | symbol, keyof SpecTypesV2.ComponentsObject | ReferenceMap> {}

export const RefSymbol = Symbol('studio:references:reference');
export const AllPropertiesSymbol = Symbol('studio:references:all-properties');
export const AllItemsSymbol = Symbol('studio:references:all-items');

let schemaMap: ReferenceMap = {
  [RefSymbol]: 'schemas',
}
schemaMap['if'] = schemaMap;
schemaMap['then'] = schemaMap;
schemaMap['else'] = schemaMap;
schemaMap['properties'] = {
  [AllPropertiesSymbol]: schemaMap,
};
schemaMap['patternProperties'] = {
  [AllPropertiesSymbol]: schemaMap,
};
schemaMap['additionalProperties'] = schemaMap;
schemaMap['additionalItems'] = schemaMap;
schemaMap['propertyNames'] = schemaMap;
schemaMap['contains'] = schemaMap;
schemaMap['allOf'] = {
  [AllItemsSymbol]: schemaMap,
};
schemaMap['oneOf'] = {
  [AllItemsSymbol]: schemaMap,
};
schemaMap['anyOf'] = {
  [AllItemsSymbol]: schemaMap,
};
schemaMap['not'] = schemaMap;
schemaMap['items'] = {
  ...schemaMap,
  [AllItemsSymbol]: schemaMap,
};

const serverMap: ReferenceMap = {
  [RefSymbol]: 'servers',
  'variables': {
    [AllPropertiesSymbol]: {
      [RefSymbol]: 'serverVariables',
    },
  },
  'bindings': {
    [RefSymbol]: 'serverBindings',
  },
}

const messageTraitMap: ReferenceMap = {
  [RefSymbol]: 'messageTraits',
  'headers': schemaMap,
  'correlationId': 'correlationIds',
  'bindings': {
    [RefSymbol]: 'messageBindings',
  },
}

const messageMap: ReferenceMap = {
  [RefSymbol]: 'messages',
  'headers': schemaMap,
  'payload': schemaMap,
  'correlationId': 'correlationIds',
  'bindings': {
    [RefSymbol]: 'messageBindings',
  },
  'traits': {
    [AllItemsSymbol]: messageTraitMap,
  }
}

const operationTraitMap: ReferenceMap = {
  [RefSymbol]: 'operationTraits',
  'bindings': {
    [RefSymbol]: 'operationBindings',
  },
}

const operationMap: ReferenceMap = {
  'message': {
    ...messageMap,
    'oneOf': {
      [AllItemsSymbol]: messageMap,
    }
  },
  'bindings': {
    [RefSymbol]: 'operationBindings',
  },
  'traits': {
    [AllItemsSymbol]: operationTraitMap,
  }
}

const parameterMap: ReferenceMap = {
  [RefSymbol]: 'parameters',
  'schema': schemaMap,
}

const channelMap: ReferenceMap = {
  [RefSymbol]: 'channels',
  'parameters': {
    [AllPropertiesSymbol]: parameterMap,
  },
  'bindings': {
    [RefSymbol]: 'channelBindings',
  },
  'publish': operationMap,
  'subscribe': operationMap,
}

export const referencesMap: ReferenceMap = {
  'servers': {
    [AllPropertiesSymbol]: serverMap,
  },
  'channels': {
    [AllPropertiesSymbol]: channelMap,
  },
  'components': {
    'servers': {
      [AllPropertiesSymbol]: serverMap,
    },
    'channels': {
      [AllPropertiesSymbol]: channelMap,
    },
    'messages': {
      [AllPropertiesSymbol]: messageMap,
    },
    'schemas': {
      [AllPropertiesSymbol]: schemaMap,
    },
    'serverVariables': {
      [AllPropertiesSymbol]: {
        [RefSymbol]: 'serverVariables',
      },
    },
    'parameters': {
      [AllPropertiesSymbol]: parameterMap,
    },
    'securitySchemes': {
      [AllPropertiesSymbol]: {
        [RefSymbol]: 'securitySchemes',
      },
    },
    'correlationIds': {
      [AllPropertiesSymbol]: {
        [RefSymbol]: 'correlationIds',
      },
    },
    'operationTraits': {
      [AllPropertiesSymbol]: operationTraitMap,
    },
    'messageTraits': {
      [AllPropertiesSymbol]: messageTraitMap,
    },
    'serverBindings': {
      [AllPropertiesSymbol]: {
        [RefSymbol]: 'serverBindings',
      }
    },
    'channelBindings': {
      [AllPropertiesSymbol]: {
        [RefSymbol]: 'channelBindings',
      }
    },
    'operationBindings': {
      [AllPropertiesSymbol]: {
        [RefSymbol]: 'operationBindings',
      }
    },
    'messageBindings': {
      [AllPropertiesSymbol]: {
        [RefSymbol]: 'messageBindings',
      }
    }
  }
};

export async function getReferenceKind(model: monacoAPI.editor.ITextModel, position: monacoAPI.Position): Promise<{ kind: keyof SpecTypesV2.ComponentsObject, isInComponent: boolean } | undefined> {
  const { documentSymbolProvider } = StandaloneServices.get(ILanguageFeaturesService);
  const outline = await OutlineModel.create(documentSymbolProvider, model);
  const symbols = outline.asListOfDocumentSymbols() as monacoAPI.languages.DocumentSymbol[];

  let refMap: any = referencesMap;
  let parent: monacoAPI.languages.DocumentSymbol | undefined;
  let index = 0;
  let isInComponent: boolean = false;
  for (const symbol of iterateSymbols(symbols, position)) {
    const { kind, name, detail } = symbol;

    if (index === 0 && name === 'components') {
      isInComponent = true;
    }

    if (kind === languages.SymbolKind.Module || kind === languages.SymbolKind.Array) {
      if (refMap[String(name)]) {
        refMap = refMap[String(name)];
      } else {
        if (parent?.kind === languages.SymbolKind.Array) { // array case - use AllItemsSymbol
          refMap = refMap[AllItemsSymbol];
        } else { // object case - use AllPropertiesSymbol
          refMap = refMap[AllPropertiesSymbol];
        }
      }
    }
    else if (kind === languages.SymbolKind.Variable) {
      if (name === '$ref' && detail === 'null') {
        return { kind: refMap[RefSymbol], isInComponent };
      }
      return;
    }

    if (!refMap) {
      return;
    }
    index++;
    parent = symbol;
  }
}

function *iterateSymbols(
  symbols: monacoAPI.languages.DocumentSymbol[],
  position: monacoAPI.Position,
): Iterable<monacoAPI.languages.DocumentSymbol> {
  for (const symbol of symbols) {
    if (Range.containsPosition(symbol.range, position)) {
      yield symbol;
      if (symbol.children) {
        yield* iterateSymbols(symbol.children, position);
      }
    }
  }
}