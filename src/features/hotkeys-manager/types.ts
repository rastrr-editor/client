import type { TypedEventEmitterWithContext } from '~/shared/lib/typed-event-emitter';

type HotkeysManagerActivatedEvent = {
  [K in `activated:${string}`]: (
    alias: string,
    context: string,
    e: KeyboardEvent
  ) => void;
};

type HotkeysManagerDeactivatedEvent = {
  [K in `deactivated:${string}`]: (
    alias: string,
    context: string,
    e: KeyboardEvent
  ) => void;
};

export type HotkeysManagerEvents = HotkeysManagerActivatedEvent &
  HotkeysManagerDeactivatedEvent;

export type HotkeysManagerEventEmitter =
  TypedEventEmitterWithContext<HotkeysManagerEvents>;

export type HotkeysContext = string | null;

export type HotkeysUnregister = () => void;
