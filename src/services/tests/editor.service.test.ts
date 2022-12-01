import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import { DiagnosticSeverity } from '@asyncapi/parser/cjs';

import { createServices } from '../';

import type { EditorService } from '../editor.service';
import type { Diagnostic } from '@asyncapi/parser/cjs';

describe('EditorService', () => {
  let editorSvc: EditorService;

  beforeAll(async () => {
    const services = await createServices();
    editorSvc = services.editorSvc;
  });

  describe('.createMarkers', () => {
    test('should create markers with errors', () => {
      const errors: Diagnostic[] = [
        {
          message: 'some error 1',
          range: {
            start: {
              line: 2,
              character: 4,
            },
            end: {
              line: 9,
              character: 14,
            }
          },
          path: ['/'],
          code: '-',
          severity: DiagnosticSeverity.Error,
        },
        {
          message: 'some error 2',
          range: {
            start: {
              line: 0,
              character: 1,
            },
            end: {
              line: 1,
              character: 2,
            }
          },
          path: ['/'],
          code: '-',
          severity: DiagnosticSeverity.Error,
        }
      ];

      const { markers, decorations } = editorSvc.createMarkersAndDecorations(errors);

      // markers
      expect(markers).toHaveLength(2);
      expect(markers[0]).toEqual({
        endColumn: 15,
        endLineNumber: 10,
        startColumn: 5,
        startLineNumber: 3,
        message: 'some error 1',
        severity: monacoAPI.MarkerSeverity.Error
      });
      expect(markers[1]).toEqual({
        endColumn: 3,
        endLineNumber: 2,
        startColumn: 2,
        startLineNumber: 1,
        message: 'some error 2',
        severity: monacoAPI.MarkerSeverity.Error
      });
      // decorations
      expect(decorations).toHaveLength(0);
    });

    test('should create decorators with warnings', () => {
      const errors: Diagnostic[] = [
        {
          message: 'some warning 1',
          range: {
            start: {
              line: 2,
              character: 4,
            },
            end: {
              line: 9,
              character: 14,
            }
          },
          path: ['/'],
          code: '-',
          severity: DiagnosticSeverity.Warning,
        },
        {
          message: 'some warning 2',
          range: {
            start: {
              line: 0,
              character: 1,
            },
            end: {
              line: 1,
              character: 2,
            }
          },
          path: ['/'],
          code: '-',
          severity: DiagnosticSeverity.Warning,
        }
      ];

      const { markers, decorations } = editorSvc.createMarkersAndDecorations(errors);

      // markers
      expect(markers).toHaveLength(0);
      // decorations
      expect(decorations).toHaveLength(2);
      expect(decorations[0]).toEqual({
        id: 'asyncapi',
        options: {
          glyphMarginClassName: 'diagnostic-warning',
          glyphMarginHoverMessage: {
            value: 'some warning 1',
          },
        },
        ownerId: 0,
        range: new monacoAPI.Range(3, 5, 10, 15),
      });
      expect(decorations[1]).toEqual({
        id: 'asyncapi',
        options: {
          glyphMarginClassName: 'diagnostic-warning',
          glyphMarginHoverMessage: {
            value: 'some warning 2',
          },
        },
        ownerId: 0,
        range: new monacoAPI.Range(1, 2, 2, 3),
      });
    });
    
    test('should not create markers and decorators without errors', () => {
      const errors: any[] = [];

      const { markers, decorations } = editorSvc.createMarkersAndDecorations(errors);
      expect(markers.length).toEqual(0);
      expect(decorations.length).toEqual(0);
    });
  });
});
