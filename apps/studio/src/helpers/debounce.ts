export function debounce(func: (...args: any[]) => any, wait: number, immediate?: boolean) {
  let timeout: number | null;

  return function executedFunction(...args: any[]) {
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
}
