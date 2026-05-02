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

async function renderMermaidBlocksInRoot(
  root: HTMLDivElement,
  isCancelled: () => boolean,
): Promise<void> {
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
}

function createMermaidRenderScheduler(
  render: () => Promise<void>,
  isCancelled: () => boolean,
): () => void {
  let renderScheduled = false;

  return () => {
    if (renderScheduled || isCancelled()) {
      return;
    }

    renderScheduled = true;
    queueMicrotask(() => {
      renderScheduled = false;
      render().catch(() => undefined);
    });
  };
}

function startPreviewObservation(
  root: HTMLDivElement,
  scheduleRender: () => void,
): { observer: MutationObserver; timeoutId: ReturnType<typeof setTimeout> } {
  const observer = new MutationObserver(scheduleRender);
  observer.observe(root, { childList: true, subtree: true });

  const timeoutId = setTimeout(() => {
    observer.disconnect();
  }, 1500);

  return { observer, timeoutId };
}

export const MarkdownPreview: React.FunctionComponent<MarkdownPreviewProps> = ({ content }) => {
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const isCancelled = () => cancelled;
    const root = previewRef.current;
    const scheduleRender = createMermaidRenderScheduler(async () => {
      const nextRoot = previewRef.current;
      if (!nextRoot) {
        return;
      }

      await renderMermaidBlocksInRoot(nextRoot, isCancelled);
    }, isCancelled);

    if (root) {
      ({ observer, timeoutId } = startPreviewObservation(root, scheduleRender));
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
