import type TypedEventEmitter from 'typed-emitter';

export type HotkeysManagerEvents = {
  deactivated: (e: KeyboardEvent, alias: string) => void;
  activated: (e: KeyboardEvent, alias: string) => void;
};

export type HotkeysManagerEventEmitter =
  TypedEventEmitter<HotkeysManagerEvents>;

export type HotkeysContext = string | null;

export type HotkeysEventData = {
  context: string;
  alias: string;
};

export type HotkeysUnregister = () => void;

export interface IHotkeysManager {
  get context(): HotkeysContext;
  emitter: HotkeysManagerEventEmitter;
  register: (keys: string[], alias: string, context?: string) => void;
  isActive: (alias: string) => boolean;
  registerContext: (name: string) => void;
  setContext: (name: HotkeysContext) => void;
}
