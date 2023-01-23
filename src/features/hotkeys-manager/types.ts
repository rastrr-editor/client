import type TypedEventEmitter from 'typed-emitter';

export type HotkeysManagerEvents = {
  deactivated: (e: KeyboardEvent, alias: string, context: string) => void;
  activated: (e: KeyboardEvent, alias: string, context: string) => void;
};

export type HotkeysManagerEventEmitter =
  TypedEventEmitter<HotkeysManagerEvents>;

export type HotkeysContext = string | null;

export type HotkeysUnregister = () => void;
