import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import { EditorService } from '../editor.service';

function createMonacoModelMock(): monacoAPI.editor.ITextModel {
  return { 
    getFullModelRange() {
      return {
        endColumn: 5,
        endLineNumber: 3,
        startColumn: 5,
        startLineNumber: 3,
      };
    }
  } as monacoAPI.editor.ITextModel;
}

describe('EditorService', () => {
  describe('.createErrorMarkers', () => {
    test('should create markers and decorators with errors', () => {
      const errors: any[] = [
        {
          title: 'some error 1',
          location: {
            startLine: 3,
            startColumn: 5,
            endLine: 10,
            endColumn: 15,
          },
          detail: 'some details',
        },
        {
          title: 'some error 2',
          location: {
            startLine: 1,
            startColumn: 2,
            endLine: 2,
            endColumn: 3,
          },
          detail: 'some details',
        }
      ];

      const { markers, decorations } = EditorService.createErrorMarkers(errors, null as any, monacoAPI);
      expect(markers.length).toEqual(2);
      expect(decorations.length).toEqual(2);

      // markers
      expect(markers[0]).toEqual({
        endColumn: 15,
        endLineNumber: 10,
        startColumn: 5,
        startLineNumber: 3,
        message: 'some error 1\n\nsome details',
        severity: monacoAPI.MarkerSeverity.Error
      });
      expect(markers[1]).toEqual({
        endColumn: 3,
        endLineNumber: 2,
        startColumn: 2,
        startLineNumber: 1,
        message: 'some error 2\n\nsome details',
        severity: monacoAPI.MarkerSeverity.Error
      });
      // decorations
      expect(decorations[0]).toEqual({
        id: 'asyncapi',
        options: {
          inlineClassName: 'bg-red-500-20',
        },
        ownerId: 0,
        range: {
          endColumn: 15,
          endLineNumber: 10,
          startColumn: 5,
          startLineNumber: 3,
        },
      });
      expect(decorations[1]).toEqual({
        id: 'asyncapi',
        options: {
          inlineClassName: 'bg-red-500-20',
        },
        ownerId: 0,
        range: {
          endColumn: 3,
          endLineNumber: 2,
          startColumn: 2,
          startLineNumber: 1,
        },
      });
    });
    
    test('should not create markers and decorators without errors', () => {
      const errors: any[] = [];

      const { markers, decorations } = EditorService.createErrorMarkers(errors, null as any, monacoAPI);
      expect(markers.length).toEqual(0);
      expect(decorations.length).toEqual(0);
    });

    test('should handle siturion without endLine and endColumn', () => {
      const errors: any[] = [
        {
          title: 'some error 1',
          location: {
            startLine: 3,
            startColumn: 5,
          },
          detail: 'some details',
        },
      ];

      const { markers, decorations } = EditorService.createErrorMarkers(errors, null as any, monacoAPI);
      expect(markers.length).toEqual(1);
      expect(decorations.length).toEqual(1);

      // markers
      expect(markers[0]).toEqual({
        endColumn: 5,
        endLineNumber: 3,
        startColumn: 5,
        startLineNumber: 3,
        message: 'some error 1\n\nsome details',
        severity: monacoAPI.MarkerSeverity.Error
      });
      // decorators
      expect(decorations[0]).toEqual({
        id: 'asyncapi',
        options: {
          inlineClassName: 'bg-red-500-20',
        },
        ownerId: 0,
        range: {
          endColumn: 5,
          endLineNumber: 3,
          startColumn: 5,
          startLineNumber: 3,
        },
      });
    });

    test('should handle situation with non location', () => {
      const errors: any[] = [
        {
          title: 'some error 1',
          detail: 'some details',
        }
      ];

      const { markers, decorations } = EditorService.createErrorMarkers(errors, createMonacoModelMock(), monacoAPI);
      expect(markers.length).toEqual(1);
      expect(decorations.length).toEqual(1);

      // markers
      expect(markers[0]).toEqual({
        endColumn: 5,
        endLineNumber: 3,
        startColumn: 5,
        startLineNumber: 3,
        message: 'some error 1\n\nsome details',
        severity: monacoAPI.MarkerSeverity.Error
      });
      // decorators
      expect(decorations[0]).toEqual({
        id: 'asyncapi',
        options: {
          inlineClassName: 'bg-red-500-20',
        },
        ownerId: 0,
        range: {
          endColumn: 5,
          endLineNumber: 3,
          startColumn: 5,
          startLineNumber: 3,
        },
      });
    });

    test('should handle situation with root jsonPointer in location', () => {
      const errors: any[] = [
        {
          title: 'some error 1',
          location: {
            jsonPointer: '/'
          },
          detail: 'some details',
        }
      ];

      const { markers, decorations } = EditorService.createErrorMarkers(errors, createMonacoModelMock(), monacoAPI);
      expect(markers.length).toEqual(1);
      expect(decorations.length).toEqual(1);

      // markers
      expect(markers[0]).toEqual({
        endColumn: 5,
        endLineNumber: 3,
        startColumn: 5,
        startLineNumber: 3,
        message: 'some error 1\n\nsome details',
        severity: monacoAPI.MarkerSeverity.Error
      });
      // decorators
      expect(decorations[0]).toEqual({
        id: 'asyncapi',
        options: {
          inlineClassName: 'bg-red-500-20',
        },
        ownerId: 0,
        range: {
          endColumn: 5,
          endLineNumber: 3,
          startColumn: 5,
          startLineNumber: 3,
        },
      });
    });
  });
});
