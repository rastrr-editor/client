import type { EventMap } from 'typed-emitter';

export interface TypedEventEmitterWithContext<Events extends EventMap> {
  addListener: <E extends keyof Events, Context extends {}>(
    event: E,
    listener: Events[E],
    ctx?: Context
  ) => this;
  on: <E extends keyof Events, Context extends {}>(
    event: E,
    listener: Events[E],
    ctx?: Context
  ) => this;
  once: <E extends keyof Events, Context extends {}>(
    event: E,
    listener: Events[E],
    ctx: Context
  ) => this;
  prependListener: <E extends keyof Events, Context extends {}>(
    event: E,
    listener: Events[E],
    ctx?: Context
  ) => this;
  prependOnceListener: <E extends keyof Events, Context extends {}>(
    event: E,
    listener: Events[E],
    ctx?: Context
  ) => this;

  off: <E extends keyof Events, Context extends {}>(
    event: E,
    listener: Events[E],
    ctx?: Context
  ) => this;
  removeAllListeners: <E extends keyof Events>(event?: E) => this;
  removeListener: <E extends keyof Events, Context extends {}>(
    event: E,
    listener: Events[E],
    ctx?: Context
  ) => this;

  emit: <E extends keyof Events>(
    event: E,
    ...args: Parameters<Events[E]>
  ) => boolean;

  // The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
  eventNames: () => Array<keyof Events | string | symbol>;
  rawListeners: <E extends keyof Events>(event: E) => Array<Events[E]>;
  listeners: <E extends keyof Events>(event: E) => Array<Events[E]>;
  listenerCount: <E extends keyof Events>(event: E) => number;

  getMaxListeners: () => number;
  setMaxListeners: (maxListeners: number) => this;
}
