import type { Command, History } from '@rastrr-editor/core';

type HistoryStoreValue = {
  commands: Command[];
  historyIndex: number;
};

export type HistoryStore = SvelteStore<HistoryStoreValue>;

export default function createHistoryStore(
  history: History | null,
  updateScrollPosition: () => void
): HistoryStore {
  const subscriptions = new Set<(value: HistoryStoreValue) => void>();

  const notifySubscribers = (): void => {
    subscriptions.forEach((subscription) => {
      subscription(value);
    });
  };

  const value: HistoryStoreValue = {
    commands: Array.from(history ?? []),
    historyIndex: history?.index ?? -1,
  };

  const onResize = (): void => {
    value.commands = Array.from(history ?? []);
    notifySubscribers();
  };

  const onUndo = ({
    index,
    success,
  }: {
    index: number;
    success: boolean;
  }): void => {
    if (success) {
      value.historyIndex = index - 1;
      notifySubscribers();
    }
  };

  const onRedo = ({
    index,
    success,
  }: {
    index: number;
    success: boolean;
  }): void => {
    if (success) {
      value.historyIndex = index;
      notifySubscribers();
    }
  };

  const onPush = (index: number, command: Command): void => {
    value.commands.push(command);
    value.historyIndex = index;
    notifySubscribers();
    updateScrollPosition();
  };

  const historyUnsubscribe = (): void => {
    history?.emitter.off('resize', onResize);
    history?.emitter.off('push', onPush);
    history?.emitter.off('undo', onUndo);
    history?.emitter.off('redo', onRedo);
  };

  history?.emitter.on('resize', onResize);
  history?.emitter.on('push', onPush);
  history?.emitter.on('undo', onUndo);
  history?.emitter.on('redo', onRedo);

  return {
    subscribe: (subscription) => {
      subscriptions.add(subscription);
      subscription(value);

      return () => {
        historyUnsubscribe();
        subscriptions.delete(subscription);
      };
    },
  };
}
