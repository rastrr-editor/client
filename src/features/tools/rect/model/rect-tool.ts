import { RectCommand, Viewport } from '@rastrr-editor/core';
import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';
import * as constants from './constants';
import { createPointerIterable } from '~/shared/lib/dom';

export default class BrushTool implements Tool<null, PointerEvent> {
  #unsubscribe: () => void = () => {};
  readonly id: string = constants.id;
  readonly name: string = constants.name;
  readonly hotkey: string | null = constants.hotkey;

  getCursor(): string | null {
    // TODO: create custom cursor
    return null;
  }

  setOptions(options: null): void {}

  createCommand(
    viewport: Viewport,
    { triggerEvent, color }: ToolCreateCommandOptions<PointerEvent>
  ): RectCommand | null {
    if (viewport.layers.activeLayer == null) {
      return null;
    }
    const iterable = createPointerIterable(
      triggerEvent,
      viewport.container,
      viewport.offset
    );
    return new RectCommand(viewport.layers, iterable, {
      color,
      operation: 'fill',
    });
  }

  destroy(): void {
    this.#unsubscribe();
  }
}
