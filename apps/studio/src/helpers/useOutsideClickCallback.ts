import { useEffect, useRef } from 'react';

type ClickTargetRef = { current: EventTarget | HTMLElement | null };

export function useOutsideClickCallback(
  refs: ClickTargetRef[],
  callback: () => void,
  enabled = true,
) {
  const refsRef = useRef(refs);
  const callbackRef = useRef(callback);
  refsRef.current = refs;
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    function handleClickOutside(event: MouseEvent) {
      const isInside = refsRef.current.some((ref) => {
        const node = ref.current;
        return node instanceof Node && node.contains(event.target as Node);
      });

      if (!isInside) {
        callbackRef.current();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [enabled]);
}
