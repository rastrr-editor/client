import type { TypedEventEmitterWithContext } from '~/shared/lib/typed-event-emitter';

export type HotkeysManagerEvents = {
  [key: string]: (alias: string, context: string, e: KeyboardEvent) => void;
};

export type HotkeysManagerEventEmitter =
  TypedEventEmitterWithContext<HotkeysManagerEvents>;

export type HotkeysContext = string | null;

export type HotkeysUnregister = () => void;
