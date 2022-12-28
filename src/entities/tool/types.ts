import type { Color, Command, Viewport } from '@rastrr-editor/core';

export type ToolCreateCommandOptions<TEvent> = {
  triggerEvent: TEvent;
  color: Color;
};

export interface Tool<TOption, TEvent> {
  id: string;
  name: string;
  hotkey: string;
  getCursor: () => string | null;
  setOptions: (options: TOption) => void;
  createCommand: (
    viewport: Viewport,
    options: ToolCreateCommandOptions<TEvent>
  ) => Command | null;
}
