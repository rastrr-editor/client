import type { Viewport, Command } from '@rastrr-editor/core';
import { type Readable, get } from 'svelte/store';
import { TOOL_CURSOR_COLOR } from '~/shared/config';
import {
  type Tool,
  type ToolCreateCommandOptions,
  toolStore,
} from '~/entities/tool';

type DrawLineToolOptions = {
  size: number;
};

export default abstract class DrawLineTool<TOptions extends DrawLineToolOptions>
  implements Tool<TOptions, PointerEvent>
{
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly hotkey: string;

  protected options: TOptions;

  protected unsubscribe: () => void = () => {};

  protected checkActiveLayerAvailability(viewport: Viewport): boolean {
    return (
      viewport.layers.activeLayer != null && !viewport.layers.activeLayer.locked
    );
  }

  constructor(optionsOrStore: TOptions | Readable<TOptions>) {
    if ('subscribe' in optionsOrStore) {
      this.options = get(optionsOrStore);
      this.unsubscribe = optionsOrStore.subscribe((value) => {
        this.options = value;
        toolStore.toolCursor.set(this.getCursor());
      });
    } else {
      this.options = optionsOrStore;
    }
  }

  getCursor(): string {
    return `url("data:image/svg+xml;base64,${btoa(
      `<svg
        width="${this.options.size + 2}"
        height="${this.options.size + 2}"
        viewBox="0 0 ${this.options.size + 2} ${this.options.size + 2}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="${this.options.size / 2 + 1}"
          cy="${this.options.size / 2 + 1}"
          r="${this.options.size / 2}"
          fill="none"
          stroke="${TOOL_CURSOR_COLOR}"
        />
      </svg>`,
    )}") ${this.options.size / 2 + 1} ${this.options.size / 2 + 1}`;
  }

  setOptions(options: TOptions): void {
    this.options = options;
  }

  destroy(): void {
    this.unsubscribe();
  }

  abstract createCommand(
    viewport: Viewport,
    toolCreateCommandOptions: ToolCreateCommandOptions<PointerEvent>,
  ): Command | null;
}
