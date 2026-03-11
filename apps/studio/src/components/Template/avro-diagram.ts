import type { File } from '@/state/files.state';

type AvroField = {
  name: string;
  typeLabel: string;
  references: string[];
  collection: boolean;
};

type AvroEntity = {
  fqName: string;
  displayName: string;
  namespace?: string;
  kind: 'record' | 'enum';
  fields: AvroField[];
  symbols: string[];
};

const AVRO_PREVIEW_TITLE = '# Avro Preview';

const AVRO_PRIMITIVES = new Set([
  'null',
  'boolean',
  'int',
  'long',
  'float',
  'double',
  'bytes',
  'string',
]);

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getDirectoryOfUri(uri: string): string {
  if (!uri) return '';
  const normalized = uri.replace(/\\/g, '/');
  const lastSlash = normalized.lastIndexOf('/');
  return lastSlash >= 0 ? normalized.slice(0, lastSlash) : '';
}

function getBasename(uri: string): string {
  const normalized = uri.replace(/\\/g, '/');
  const lastSlash = normalized.lastIndexOf('/');
  return lastSlash >= 0 ? normalized.slice(lastSlash + 1) : normalized;
}

function isAvroReferenceFile(uri: string): boolean {
  return uri.toLowerCase().endsWith('.avsc');
}

function getTypeNameAndNamespace(fqName: string): { typeName: string; namespace?: string } {
  const idx = fqName.lastIndexOf('.');
  if (idx < 0) {
    return { typeName: fqName, namespace: undefined };
  }
  return {
    typeName: fqName.slice(idx + 1),
    namespace: fqName.slice(0, idx),
  };
}

function getQualifiedName(name: string, namespace?: string): string {
  if (!name) return '';
  if (name.includes('.')) return name;
  return namespace ? `${namespace}.${name}` : name;
}

function getShortName(fqName: string): string {
  const idx = fqName.lastIndexOf('.');
  return idx >= 0 ? fqName.slice(idx + 1) : fqName;
}

function getClassId(fqName: string): string {
  const normalized = fqName.replace(/[^a-zA-Z0-9_]/g, '_');
  return normalized || 'UnknownType';
}

function escapeMermaidLabel(value: string): string {
  return String(value).replace(/"/g, '\\"');
}

function analyzeType(
  typeValue: unknown,
  namespace: string | undefined,
  entities: Map<string, AvroEntity>,
): { label: string; references: string[]; collection: boolean } {
  if (typeof typeValue === 'string') {
    if (AVRO_PRIMITIVES.has(typeValue)) {
      return { label: typeValue, references: [], collection: false };
    }
    const fqName = getQualifiedName(typeValue, namespace);
    return { label: getShortName(fqName), references: [fqName], collection: false };
  }

  if (Array.isArray(typeValue)) {
    const analyzed = typeValue
      .filter((entry) => !(typeof entry === 'string' && entry === 'null'))
      .map((entry) => analyzeType(entry, namespace, entities));
    const labels = analyzed.map((entry) => entry.label);
    const refs = analyzed.flatMap((entry) => entry.references);
    return {
      label: labels.length > 0 ? labels.join(' | ') : 'null',
      references: Array.from(new Set(refs)),
      collection: false,
    };
  }

  if (!isObject(typeValue)) {
    return { label: 'unknown', references: [], collection: false };
  }

  const rawType = typeValue.type;
  if (rawType === 'array') {
    const items = analyzeType(typeValue.items, namespace, entities);
    return {
      label: `${items.label}[]`,
      references: items.references,
      collection: true,
    };
  }

  if (rawType === 'map') {
    const values = analyzeType(typeValue.values, namespace, entities);
    return {
      label: `map[string, ${values.label}]`,
      references: values.references,
      collection: false,
    };
  }

  if (rawType === 'record') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const nested = extractRecord(typeValue, namespace, entities);
    return {
      label: nested ? getShortName(nested.fqName) : 'record',
      references: nested ? [nested.fqName] : [],
      collection: false,
    };
  }
  if (rawType === 'enum') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const nestedEnum = extractEnum(typeValue, namespace, entities);
    return {
      label: nestedEnum ? getShortName(nestedEnum.fqName) : 'enum',
      references: nestedEnum ? [nestedEnum.fqName] : [],
      collection: false,
    };
  }

  if (typeof rawType === 'string') {
    if (AVRO_PRIMITIVES.has(rawType)) {
      return { label: rawType, references: [], collection: false };
    }
    const fqName = getQualifiedName(rawType, namespace);
    return { label: getShortName(fqName), references: [fqName], collection: false };
  }

  if (Array.isArray(rawType)) {
    return analyzeType(rawType, namespace, entities);
  }

  return { label: 'unknown', references: [], collection: false };
}

function extractRecord(
  schema: unknown,
  fallbackNamespace: string | undefined,
  entities: Map<string, AvroEntity>,
): AvroEntity | undefined {
  if (!isObject(schema) || schema.type !== 'record' || typeof schema.name !== 'string') {
    return undefined;
  }

  const namespace = typeof schema.namespace === 'string' ? schema.namespace : fallbackNamespace;
  const fqName = getQualifiedName(schema.name, namespace);
  if (!fqName) {
    return undefined;
  }

  const existing = entities.get(fqName);
  if (existing && existing.kind === 'record' && existing.fields.length > 0) {
    return existing;
  }

  const fields: AvroField[] = [];
  const avroFields = Array.isArray(schema.fields) ? schema.fields : [];
  for (const field of avroFields) {
    if (!isObject(field) || typeof field.name !== 'string') {
      continue;
    }
    const analyzed = analyzeType(field.type, namespace, entities);
    fields.push({
      name: field.name,
      typeLabel: analyzed.label,
      references: analyzed.references,
      collection: analyzed.collection,
    });
  }

  const record: AvroEntity = {
    fqName,
    displayName: getShortName(fqName),
    namespace,
    kind: 'record',
    fields,
    symbols: [],
  };
  entities.set(fqName, record);
  return record;
}

function extractEnum(
  schema: unknown,
  fallbackNamespace: string | undefined,
  entities: Map<string, AvroEntity>,
): AvroEntity | undefined {
  if (!isObject(schema) || schema.type !== 'enum' || typeof schema.name !== 'string') {
    return undefined;
  }

  const namespace = typeof schema.namespace === 'string' ? schema.namespace : fallbackNamespace;
  const fqName = getQualifiedName(schema.name, namespace);
  if (!fqName) {
    return undefined;
  }

  const existing = entities.get(fqName);
  if (existing && existing.kind === 'enum' && existing.symbols.length > 0) {
    return existing;
  }

  const symbols = Array.isArray(schema.symbols)
    ? schema.symbols.filter((symbol): symbol is string => typeof symbol === 'string')
    : [];

  const entity: AvroEntity = {
    fqName,
    displayName: getShortName(fqName),
    namespace,
    kind: 'enum',
    fields: [],
    symbols,
  };
  entities.set(fqName, entity);
  return entity;
}

function extractEntitiesFromSchema(schema: unknown, entities: Map<string, AvroEntity>): void {
  if (Array.isArray(schema)) {
    for (const item of schema) {
      extractEntitiesFromSchema(item, entities);
    }
    return;
  }

  if (!isObject(schema)) {
    return;
  }

  const record = extractRecord(schema, undefined, entities);
  if (record) {
    return;
  }
  const enumEntity = extractEnum(schema, undefined, entities);
  if (enumEntity) {
    return;
  }

  if (isObject(schema.type) || Array.isArray(schema.type)) {
    extractEntitiesFromSchema(schema.type, entities);
  }
  if (Array.isArray(schema.fields)) {
    for (const field of schema.fields) {
      if (isObject(field)) {
        extractEntitiesFromSchema(field.type, entities);
      }
    }
  }
}

function getSameFolderAvroFiles(activeUri: string, files: Record<string, File>): File[] {
  const activeDir = getDirectoryOfUri(activeUri);
  return Object.values(files).filter((file) => {
    if (file.uri === 'asyncapi' || file.uri === activeUri) {
      return false;
    }
    if (!isAvroReferenceFile(file.uri)) {
      return false;
    }
    return getDirectoryOfUri(file.uri) === activeDir;
  });
}

function findReferenceFile(
  referenceFqName: string,
  activeUri: string,
  files: Record<string, File>,
): File | undefined {
  const candidates = getSameFolderAvroFiles(activeUri, files);
  const { typeName, namespace } = getTypeNameAndNamespace(referenceFqName);
  const exactByType = `${typeName}.avsc`.toLowerCase();
  const exactByNamespace = namespace ? `${namespace}.${typeName}.avsc`.toLowerCase() : '';

  const byName = candidates.find((candidate) => getBasename(candidate.uri).toLowerCase() === exactByType);
  if (byName) {
    return byName;
  }

  if (exactByNamespace) {
    const byNamespaceName = candidates.find(
      (candidate) => getBasename(candidate.uri).toLowerCase() === exactByNamespace,
    );
    if (byNamespaceName) {
      return byNamespaceName;
    }
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate.content);
      const tempEntities = new Map<string, AvroEntity>();
      extractEntitiesFromSchema(parsed, tempEntities);
      if (tempEntities.has(referenceFqName)) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return undefined;
}

function ensurePlaceholdersForReferences(entities: Map<string, AvroEntity>): void {
  const references = new Set<string>();
  const entityList = Array.from(entities.values());
  for (const entity of entityList) {
    for (const field of entity.fields) {
      for (const ref of field.references) {
        references.add(ref);
      }
    }
  }

  const referenceList = Array.from(references);
  for (const ref of referenceList) {
    if (!entities.has(ref)) {
      const { namespace } = getTypeNameAndNamespace(ref);
      entities.set(ref, {
        fqName: ref,
        displayName: getShortName(ref),
        namespace,
        kind: 'record',
        fields: [],
        symbols: [],
      });
    }
  }
}

function resolveExternalReferences(
  activeFile: File,
  files: Record<string, File>,
  entities: Map<string, AvroEntity>,
): void {
  const parsedFiles = new Set<string>([activeFile.uri]);
  const queue: string[] = [];
  const queued = new Set<string>();

  const enqueueMissingRefs = () => {
    const entityList = Array.from(entities.values());
    for (const entity of entityList) {
      for (const field of entity.fields) {
        for (const ref of field.references) {
          if (!entities.has(ref) && !queued.has(ref)) {
            queue.push(ref);
            queued.add(ref);
          }
        }
      }
    }
  };

  enqueueMissingRefs();
  while (queue.length > 0) {
    const targetRef = queue.shift();
    if (!targetRef || entities.has(targetRef)) {
      continue;
    }

    const refFile = findReferenceFile(targetRef, activeFile.uri, files);
    if (!refFile) {
      const { namespace } = getTypeNameAndNamespace(targetRef);
      entities.set(targetRef, {
        fqName: targetRef,
        displayName: getShortName(targetRef),
        namespace,
        kind: 'record',
        fields: [],
        symbols: [],
      });
      continue;
    }

    if (!parsedFiles.has(refFile.uri)) {
      parsedFiles.add(refFile.uri);
      try {
        const parsed = JSON.parse(refFile.content);
        extractEntitiesFromSchema(parsed, entities);
      } catch {
        const { namespace } = getTypeNameAndNamespace(targetRef);
        entities.set(targetRef, {
          fqName: targetRef,
          displayName: getShortName(targetRef),
          namespace,
          kind: 'record',
          fields: [],
          symbols: [],
        });
      }
    }

    if (!entities.has(targetRef)) {
      const { namespace } = getTypeNameAndNamespace(targetRef);
      entities.set(targetRef, {
        fqName: targetRef,
        displayName: getShortName(targetRef),
        namespace,
        kind: 'record',
        fields: [],
        symbols: [],
      });
    }

    enqueueMissingRefs();
  }
}

function renderMermaid(entities: Map<string, AvroEntity>): string {
  const lines: string[] = ['classDiagram'];
  const sortedEntities = Array.from(entities.values()).sort((a, b) => a.fqName.localeCompare(b.fqName));

  for (const entity of sortedEntities) {
    const classId = getClassId(entity.fqName);
    lines.push(`class ${classId}["${escapeMermaidLabel(entity.fqName)}"]`);

    if (entity.kind === 'enum' || entity.fields.length > 0) {
      lines.push(`class ${classId} {`);
      if (entity.kind === 'enum') {
        lines.push('  <<enumeration>>');
        for (const symbol of entity.symbols) {
          lines.push(`  ${escapeMermaidLabel(symbol)}`);
        }
      } else {
        for (const field of entity.fields) {
          lines.push(`  ${escapeMermaidLabel(field.name)}: ${escapeMermaidLabel(field.typeLabel)}`);
        }
      }
      lines.push('}');
    }
  }

  const relationKeys = new Set<string>();
  for (const entity of sortedEntities) {
    const fromId = getClassId(entity.fqName);
    for (const field of entity.fields) {
      for (const ref of field.references) {
        const toId = getClassId(ref);
        const key = `${fromId}|${toId}|${field.name}`;
        if (relationKeys.has(key)) {
          continue;
        }
        relationKeys.add(key);
        const relationLabel = field.collection ? `${field.name}[]` : field.name;
        lines.push(`${fromId} --> ${toId} : ${escapeMermaidLabel(relationLabel)}`);
      }
    }
  }

  return lines.join('\n');
}

export function isAvroSchemaFile(file?: File): boolean {
  if (!file) return false;
  const uri = String(file.uri || '').toLowerCase();
  return uri.endsWith('.avsc');
}

export function buildAvroDiagramMarkdown(file: File | undefined, files: Record<string, File>): string {
  if (!file || !isAvroSchemaFile(file)) {
    return [
      AVRO_PREVIEW_TITLE,
      '',
      'Open an `.avsc` file to generate a Mermaid class diagram.',
    ].join('\n');
  }

  let parsedSchema: unknown;
  try {
    parsedSchema = JSON.parse(file.content);
  } catch {
    return [
      AVRO_PREVIEW_TITLE,
      '',
      'The active `.avsc` file is not valid JSON, so a diagram cannot be generated.',
    ].join('\n');
  }

  const entities = new Map<string, AvroEntity>();
  extractEntitiesFromSchema(parsedSchema, entities);

  if (entities.size === 0) {
    return [
      AVRO_PREVIEW_TITLE,
      '',
      'No Avro records or enums were found in this file.',
    ].join('\n');
  }

  resolveExternalReferences(file, files, entities);
  ensurePlaceholdersForReferences(entities);

  const mermaid = renderMermaid(entities);
  return [
    '```mermaid',
    mermaid,
    '```',
  ].join('\n');
}
