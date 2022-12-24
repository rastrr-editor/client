import type { Command } from '@rastrr-editor/core';

export interface Tool<TOption> {
  id: string;
  name: string;
  hotkey: string;
  getCursor: () => string | null;
  setOptions: (options: TOption) => void;
  // FIXME: this is temporary
  createCommand: (...args: any) => Command;
}
