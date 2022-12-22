import { useEffect } from 'react';
import { useServices } from '../services';

import type { OnOptions } from 'eventemitter2';
import type { EventKinds } from '../types';

export function useOnEvent<K extends keyof EventKinds = keyof EventKinds>(event: K, listenerFn: EventKinds[K], deps: Array<any> = [], options?: boolean | Exclude<OnOptions, 'objectify'>) {
  const { eventsSvc } = useServices();

  useEffect(() => {
    const listener = eventsSvc.subscribe(event, listenerFn, options);
    return () => {
      listener.unsubscribe();
    }
  }, [eventsSvc, event, listenerFn, options, ...deps]);
}
