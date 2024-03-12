'use client';

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { useEffect, useRef } from 'react';
import {
  oneDarkTheme,
  oneDarkHighlightStyle,
} from '@codemirror/theme-one-dark';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { syntaxHighlighting } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

interface ICodeMirrorProps {
  language: 'json' | 'yaml';
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export const CodeMirror = (props: ICodeMirrorProps) => {
  const { language, value, onChange, autoFocus, className } = props;

  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView>();

  useEffect(() => {
    let currentValue;
    if (window) {
      console.log('Getting asyncapi from local storage...');
      currentValue = localStorage.getItem('document') || value;
      onChange(currentValue);
    }

    if (editorRef.current) {
      const theme = EditorView.theme({
        '&': {
          backgroundColor: '#252f3f',
          color: '#fff',
        },

        '&.cm-editor': {
          height: '100%',
          width: '100%',
        },

        '&.cm-focused': {
          backgroundColor: '#1f2a37',
        },
      });

      const editorState = EditorState.create({
        doc: currentValue,
        extensions: [
          basicSetup,
          theme,
          keymap.of([indentWithTab]),
          oneDarkTheme,
          syntaxHighlighting(oneDarkHighlightStyle),
          language === 'json' ? json() : yaml(),
          EditorView.updateListener.of((update) => {    
            if (update.docChanged) {
              onChange(update.state.doc.toString());

              if (window !== undefined) {
                localStorage.setItem('document', update.state.doc.toString());
              }
            }

            return false;
          }),
        ],
      });

      editorViewRef.current = new EditorView({
        parent: editorRef.current,
        state: editorState,
      });

      if (autoFocus) {
        editorViewRef.current.focus();
      }

      return () => {
        editorViewRef.current?.destroy();
      };
    }
  }, [language]);

  return (
    <div
      ref={editorRef}
      className={`${className} flex-grow relative overflow-auto`}
    />
  );
};
