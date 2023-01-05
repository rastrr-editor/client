import { BrushCommand, Viewport } from '@rastrr-editor/core';
import { get } from 'svelte/store';
import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';
import { toolStore } from '~/entities/tool';
import type { BrushOptions } from '../types';
import { options as defaultOptions } from './store';
import * as constants from './constants';
import { createPointerIterable } from '~/shared/lib/dom';

export default class BrushTool implements Tool<BrushOptions, PointerEvent> {
  #options: BrushOptions;
  #unsubscribe: () => void = () => {};
  readonly id: string = constants.id;
  readonly name: string = constants.name;
  readonly hotkey: string = constants.hotkey;

  constructor(options?: BrushOptions) {
    this.#options = options ?? get(defaultOptions);
    if (options == null) {
      this.#unsubscribe = defaultOptions.subscribe((value) => {
        this.#options = value;
        toolStore.toolCursor.set(this.getCursor());
      });
    }
  }

  getCursor(): string {
    return `url("data:image/svg+xml;base64,${btoa(
      `<svg
        width="${this.#options.size + 2}"
        height="${this.#options.size + 2}"
        viewBox="0 0 ${this.#options.size + 2} ${this.#options.size + 2}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="${this.#options.size / 2 + 1}"
          cy="${this.#options.size / 2 + 1}"
          r="${this.#options.size / 2}"
          fill="none"
          stroke="#c1c1c1"
        />
      </svg>`
    )}") ${this.#options.size / 2 + 1} ${this.#options.size / 2 + 1}`;
  }

  setOptions(options: BrushOptions): void {
    this.#options = options;
  }

  createCommand(
    viewport: Viewport,
    { triggerEvent, color }: ToolCreateCommandOptions<PointerEvent>
  ): BrushCommand | null {
    if (
      viewport.layers.activeLayer == null ||
      viewport.layers.activeLayer.locked
    ) {
      return null;
    }
    const iterable = createPointerIterable(
      triggerEvent,
      viewport.container,
      viewport.offset
    );
    return new BrushCommand(viewport.layers, iterable, {
      color: color.clone().setOpacity(this.#options.opacity),
      width: this.#options.size,
    });
  }

  destroy(): void {
    this.#unsubscribe();
  }
}
