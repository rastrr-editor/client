import type { Unsubscriber } from 'svelte/store';
import type { Viewport } from '@rastrr-editor/core';
import { hotkeys } from '~/features/hotkeys-manager';

export enum HistoryEvents {
  UNDO = 'undo',
  REDO = 'redo',
}

const handleAction = function handleAction(
  this: Viewport,
  alias: string,
  _ctx: string,
  event: KeyboardEvent,
): void {
  event.preventDefault();

  const {
    history,
    history: { isLocked },
  } = this;
  const [action] = alias.split(':').slice(-1) as HistoryEvents[];

  if (isLocked) {
    return;
  }

  // TODO: show alert
  history[action]().catch(() => null);
};

export const handleHistoryHotkeys = (
  value: Viewport | null,
): Unsubscriber | undefined => {
  if (value === null) {
    return;
  }

  hotkeys.emitter.on(`activated:${HistoryEvents.UNDO}`, handleAction, value);
  hotkeys.emitter.on(`activated:${HistoryEvents.REDO}`, handleAction, value);

  return () => {
    hotkeys.emitter.off(`activated:${HistoryEvents.UNDO}`, handleAction);
    hotkeys.emitter.off(`activated:${HistoryEvents.REDO}`, handleAction);
  };
};
