import type { Unsubscriber } from 'svelte/store';
import type { Viewport } from '@rastrr-editor/core';
import { hotkeys } from '~/features/hotkeys-manager';

enum Events {
  UNDO = 'undo',
  REDO = 'redo',
}

const handleAction = function handleAction(
  this: Viewport,
  alias: string
): void {
  const {
    history,
    history: { isLocked },
  } = this;
  const [action] = alias.split(':').slice(-1) as Events[];

  if (isLocked) {
    return;
  }

  history[action]()
    // @ts-expect-error
    .then(() => history.emitter.emit(action))
    .catch(() => null);
};

export const handleHistoryHotkeys = (
  value: Viewport | null
): Unsubscriber | undefined => {
  if (value === null) {
    return;
  }

  hotkeys.emitter.on(`activated:${Events.UNDO}`, handleAction, value);
  hotkeys.emitter.on(`activated:${Events.REDO}`, handleAction, value);

  return () => {
    hotkeys.emitter.off(`activated:${Events.UNDO}`, handleAction);
    hotkeys.emitter.off(`activated:${Events.REDO}`, handleAction);
  };
};
