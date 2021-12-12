export interface DebounceFn {
  (...args: any[]): any,
  cancel(): void;
}

export function debounce(func: (...args: any[]) => any, wait: number, immediate?: boolean): DebounceFn {
  let timeout: number | null;

  const fn = function executedFunction(...args: any[]) {
    // @ts-ignore
    const context = this;

    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait) as unknown as number;

    if (callNow) {
      func.apply(context, args);
    }
  };
  (fn as unknown as DebounceFn).cancel = function() {
    timeout && clearTimeout(timeout);
  };

  return fn as unknown as DebounceFn;
}
