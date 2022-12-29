import { BrushCommand, Viewport, events, asyncIter } from '@rastrr-editor/core';
import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';
import type { BrushOptions } from '../types';

export default class BrushTool implements Tool<BrushOptions, PointerEvent> {
  #options: BrushOptions;
  readonly id: string = 'brush';
  readonly name: string = 'Кисть';
  readonly hotkey: string = 'B';

  constructor(options: BrushOptions = { size: 1 }) {
    this.#options = options;
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
    // TODO: refactor using dot notation
    const iterable = asyncIter.map(
      asyncIter.seq(
        asyncIter.toAsyncIter([triggerEvent]),
        asyncIter.until(
          asyncIter.any(
            events.on(viewport.container, 'pointermove'),
            events.on(viewport.container, 'pointerup')
          ),
          events.onlyEvent('pointerup')
        )
      ),
      (e) => ({
        x: e.offsetX - viewport.offset.x,
        y: e.offsetY - viewport.offset.y,
      })
    );
    return new BrushCommand(viewport.layers, iterable, {
      color,
      width: this.#options.size,
    });
  }

  destroy(): void {}
}
