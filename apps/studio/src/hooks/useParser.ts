import Parser from "@asyncapi/parser/browser";
import { documentsState, filesState, settingsState, useFilesState } from "../states";
import { DocumentDiagnostics } from "../states/documents.state";
import { DiagnosticSeverity } from "@asyncapi/parser";
import { Diagnostic, ParseOptions, ParseOutput } from "@asyncapi/parser/cjs";
import { useEffect, useState } from "react";

export const useParser = () => {
  if (typeof window === 'undefined') return{
    parse: () => {},
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
    try {
      if(parser === undefined) return;
      const { document, diagnostics: _diagnostics, extras } : ParseOutput = await parser.parse(spec, options);
      diagnostics = _diagnostics;
      updateDocument(uri, {
        uri,
        document,
        diagnostics: createDiagnostics(diagnostics),
        extras,
        valid: true,
      })
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

  filesState.subscribe((state, prevState) => {
    const newFiles = state.files;
    const oldFiles = prevState.files;

    Object.entries(newFiles).forEach(([uri, file]) => {
      const oldFile = oldFiles[String(uri)];
      if (file === oldFile) return;
      parse(uri, file.content, { source: file.source }).catch(console.error);
    });
  });

  //Initial parse
  // useEffect(() => {
  //   const file = useFilesState(state => state.files['asyncapi']);
  //   if (file) {
  //     parse('asyncapi', file.content, { source: file.source }).catch(console.error);
  //   }
  // }, []);


  return {
    parse,
  }
}