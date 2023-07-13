import Parser from "@asyncapi/parser/browser";
import { documentsState, filesState, settingsState, useFilesState } from "../states";
import { DocumentDiagnostics } from "../states/documents.state";
import { Diagnostic, ParseOptions, ParseOutput, OldAsyncAPIDocument, convertToOldAPI, DiagnosticSeverity } from "@asyncapi/parser/cjs";
import { untilde } from '@asyncapi/parser/cjs/utils'
import { useEffect, useState } from "react";
import { isDeepEqual } from "../helpers";
import { ServiceProps } from "./useServices";

export const useParser = (props: ServiceProps) => {
  if (typeof window === 'undefined') return{
    parse: () => {},
    getRangeForJsonPath: () => {},
    filterDiagnostics,
    filterDiagnosticsBySeverity,
    document: undefined,
  }

  let parser : typeof Parser = undefined;
  if (typeof window !== 'undefined') parser = new Parser();
  const updateDocument = documentsState.getState().updateDocument;

  const createDiagnostics = (diagnostics: Diagnostic[]) => {
    // map messages of invalid ref to file
    diagnostics.forEach(diagnostic => {
      if (diagnostic.code === 'invalid-ref' && diagnostic.message.endsWith('readFile is not a function')) {
        diagnostic.message = 'File references are not yet supported in Studio';
      }
    });
    
    const collections: DocumentDiagnostics = {
      original: diagnostics,
      filtered: [],
      errors: [],
      warnings: [],
      informations: [],
      hints: [],
    };

    const { governance: { show } } = settingsState.getState();
    diagnostics.forEach(diagnostic => {
      const severity = diagnostic.severity;
      if (severity === DiagnosticSeverity.Error) {
        collections.filtered.push(diagnostic);
        collections.errors.push(diagnostic);
      } else if (severity === DiagnosticSeverity.Warning && show.warnings) {
        collections.filtered.push(diagnostic);
        collections.warnings.push(diagnostic);
      } else if (severity === DiagnosticSeverity.Information && show.informations) {
        collections.filtered.push(diagnostic);
        collections.informations.push(diagnostic);
      } else if (severity === DiagnosticSeverity.Hint && show.hints) {
        collections.filtered.push(diagnostic);
        collections.hints.push(diagnostic);
      }
    });

    return collections;
  }

  const parse = async (uri: string, spec: string, options: ParseOptions = {}): Promise<void> => {
    if (uri !== 'asyncapi' && !options.source) {
      options.source = uri;
    }

    let diagnostics: Diagnostic[] = [];
    let oldDocument: OldAsyncAPIDocument;
    try {
      if(parser === undefined) return;
      const { document, diagnostics: _diagnostics, extras } : ParseOutput = await parser.parse(spec, options);
      diagnostics = _diagnostics;
      if(document) {
        oldDocument = convertToOldAPI(document);
        updateDocument(uri, {
          uri,
          document,
          oldDocument,
          diagnostics: createDiagnostics(diagnostics),
          extras,
          valid: true,
        })
      }
    } catch (e) {
      updateDocument(uri, {
        uri,
        document: undefined,
        diagnostics: createDiagnostics(diagnostics),
        extras: undefined,
        valid: false,
      });
      
      console.error(e);
    }
  }

  // Helpers

  const getRangeForJsonPath = (uri: string, jsonPath: string | Array<string | number>) => {
    try {
      const { documents } = documentsState.getState();
      const extras = documents[String(uri)]?.extras;
      if (extras) {
        jsonPath = Array.isArray(jsonPath) ? jsonPath : jsonPath.split('/').map(untilde);
        if (jsonPath[0] === '') jsonPath.shift();
        return extras.document.getRangeForJsonPath(jsonPath, true);
      }
    } catch (err: any) {
      return;
    }
  }

  function filterDiagnostics (diagnostics: Diagnostic[]) {
    const { governance: { show } } = settingsState.getState();
    return diagnostics.filter(({ severity }) => {
      return (
        severity === DiagnosticSeverity.Error ||
        (severity === DiagnosticSeverity.Warning && show.warnings) ||
        (severity === DiagnosticSeverity.Information && show.informations) ||
        (severity === DiagnosticSeverity.Hint && show.hints)
      );
    });
  }

  function filterDiagnosticsBySeverity (diagnostics: Diagnostic[], severity: DiagnosticSeverity) {
    return diagnostics.filter(diagnostic => diagnostic.severity === severity);
  }


  // Subscribe to states change

  filesState.subscribe((state, prevState) => {
    const newFiles = state.files;
    const oldFiles = prevState.files;
    console.log(newFiles);

    Object.entries(newFiles).forEach(([uri, file]) => {
      const oldFile = oldFiles[String(uri)];
      if (file === oldFile) return;
      parse(uri, file.content, { source: file.source }).catch(console.error);
    });
  });

  settingsState.subscribe((state, prevState) => {
    if (isDeepEqual(state.governance, prevState.governance)) return;

    const { files } = filesState.getState();
    Object.entries(files).forEach(([uri, file]) => {
      parse(uri, file.content).catch(console.error);
    });
  });

  return {
    parse,
    filterDiagnostics,
    filterDiagnosticsBySeverity,
    getRangeForJsonPath,
  }
}