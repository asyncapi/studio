import EventEmitter2 from "eventemitter2";

import type { event, eventNS, OnOptions, ListenerFn, Listener } from 'eventemitter2';
import type { Services } from "./index";

export class EventEmitterService extends EventEmitter2 {
  constructor(
    protected readonly svcs: Services = {} as Services,
  ) {
    super({
      // set this to `true` to use wildcards
      wildcard: true,
      // the delimiter used to segment namespaces
      delimiter: ':', 
      // set this to `true` if you want to emit the newListener event
      newListener: false, 
      // set this to `true` if you want to emit the removeListener event
      removeListener: false, 
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10000,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: true,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: true,
    });
  }

  public onInit(): void | Promise<void> {}
  public onAfterInit(): void | Promise<void> {}
  public onAfterAppInit(): void | Promise<void> {}

  subscribe(event: event | eventNS, listenerFn: ListenerFn, options?: boolean | Exclude<OnOptions, 'objectify'>) {
    const listener = this.on(event, listenerFn, this.serializeOptions(options)) as Listener;
    return {
      unsubscribe() {
        listener.off();
      }
    }
  }

  private serializeOptions(options?: boolean | Exclude<OnOptions, 'objectify'>): OnOptions {
    if (options === true) {
      return { promisify: true, objectify: true };
    }
    if (options === false) {
      return { async: true, objectify: true };
    }
    return options ? { ...options, objectify: true } : { objectify: true };
  }
}