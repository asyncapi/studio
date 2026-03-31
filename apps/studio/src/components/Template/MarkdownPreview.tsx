import React, { useEffect, useRef } from 'react';

import { Markdown } from '../common';

interface MarkdownPreviewProps {
  content: string;
}

let mermaidLoader: Promise<any> | null = null;

function looksLikeMermaidDefinition(codeElement: Element): boolean {
  const className = (codeElement as HTMLElement).className || '';
  if (className.includes('mermaid')) {
    return true;
  }

  const content = (codeElement.textContent || '').trimStart();
  if (!content) {
    return false;
  }

  return (
    content.startsWith('classDiagram') ||
    content.startsWith('graph ') ||
    content.startsWith('flowchart') ||
    content.startsWith('sequenceDiagram') ||
    content.startsWith('erDiagram') ||
    content.startsWith('stateDiagram') ||
    content.startsWith('gantt') ||
    content.startsWith('journey') ||
    content.startsWith('pie')
  );
}

async function loadMermaid() {
  mermaidLoader ??= import('mermaid').then((module) => {
    const mermaid = module.default;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
    });
    return mermaid;
  });
  return mermaidLoader;
}

async function isValidMermaidDefinition(mermaid: any, definition: string): Promise<boolean> {
  try {
    const result = await mermaid.parse(definition, { suppressErrors: true });
    return result !== false;
  } catch {
    return false;
  }
}

function getMermaidCodeBlocks(root: HTMLDivElement): HTMLElement[] {
  return Array.from(root.querySelectorAll('pre code'))
    .filter((codeElement) => looksLikeMermaidDefinition(codeElement)) as HTMLElement[];
}

async function renderMermaidCodeBlock(
  mermaid: any,
  codeElement: HTMLElement,
  index: number,
  isCancelled: () => boolean,
): Promise<void> {
  const definition = codeElement.textContent?.trim() || '';
  if (!definition) {
    return;
  }

  const pre = codeElement.closest('pre');
  if (!pre || isCancelled()) {
    return;
  }

  const isValid = await isValidMermaidDefinition(mermaid, definition);
  if (!isValid || isCancelled()) {
    return;
  }

  try {
    const id = `studio-mermaid-${Date.now()}-${index}`;
    const { svg, bindFunctions } = await mermaid.render(id, definition);
    if (isCancelled()) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'my-4 overflow-x-auto bg-white p-4 rounded';
    wrapper.innerHTML = svg;
    bindFunctions?.(wrapper);
    pre.replaceWith(wrapper);
  } catch {
    return;
  }
}

export const MarkdownPreview: React.FunctionComponent<MarkdownPreviewProps> = ({ content }) => {
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let renderScheduled = false;

    const isCancelled = () => cancelled;

    const renderMermaidBlocks = async () => {
      const root = previewRef.current;
      if (!root) {
        return;
      }

      const codeBlocks = getMermaidCodeBlocks(root);
      if (codeBlocks.length === 0) {
        return;
      }

      try {
        const mermaid = await loadMermaid();
        await Promise.all(
          codeBlocks.map((codeElement, index) =>
            renderMermaidCodeBlock(mermaid, codeElement, index, isCancelled),
          ),
        );
      } catch {
        return;
      }
    };

    const scheduleRender = () => {
      if (renderScheduled || cancelled) {
        return;
      }

      renderScheduled = true;
      queueMicrotask(() => {
        renderScheduled = false;
        renderMermaidBlocks().catch(() => undefined);
      });
    };

    const root = previewRef.current;
    if (root) {
      observer = new MutationObserver(() => {
        scheduleRender();
      });
      observer.observe(root, { childList: true, subtree: true });
      timeoutId = setTimeout(() => {
        observer?.disconnect();
      }, 1500);
    }

    scheduleRender();

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [content]);

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <div ref={previewRef} className="overflow-auto h-full text-gray-900 p-4 bg-white">
        <Markdown>
          {content}
        </Markdown>
      </div>
    </div>
  );
};
