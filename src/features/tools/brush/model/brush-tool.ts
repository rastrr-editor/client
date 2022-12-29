import type { ColorRange } from '@rastrr-editor/core';
import {
  BrushCommand,
  Viewport,
  events,
  asyncIter,
  Color,
} from '@rastrr-editor/core';
import { get } from 'svelte/store';
import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';
import { toolStore } from '~/entities/tool';
import type { BrushOptions } from '../types';
import { options as defaultOptions } from './store';
import * as constants from './constants';
import { getCoords } from '~/shared/lib/dom';

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
    if (viewport.layers.activeLayer == null) {
      return null;
    }
    const coords = getCoords(viewport.container);
    // TODO: refactor using dot notation
    const iterable = asyncIter.map(
      asyncIter.every(
        asyncIter.seq(
          asyncIter.toAsyncIter([triggerEvent]),
          asyncIter.until(
            asyncIter.any(
              events.on(document.body, 'pointermove'),
              events.on(document.body, 'pointerup')
            ),
            events.onlyEvent('pointerup')
          )
        ),
        (e) => {
          console.log(coords, 'x', e.pageX, 'y', e.pageY);
          return !(
            e.pageX < coords.left ||
            e.pageX > coords.right ||
            e.pageY < coords.top ||
            e.pageY > coords.bottom
          );
        }
      ),
      (e) => ({
        x: e.offsetX - viewport.offset.x,
        y: e.offsetY - viewport.offset.y,
      })
    );
    return new BrushCommand(viewport.layers, iterable, {
      // TODO: reconsider constructor args or add opacity method for color
      color: new Color(
        color.r,
        color.g,
        color.b,
        Math.round(Math.min(this.#options.opacity, 1) * 255) as ColorRange
      ),
      width: this.#options.size,
    });
  }

  destroy(): void {
    this.#unsubscribe();
  }
}
