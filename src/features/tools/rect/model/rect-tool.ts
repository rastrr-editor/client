import { RectCommand, Viewport } from '@rastrr-editor/core';
import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';
import * as constants from './constants';
import { createPointerIterable } from '~/shared/lib/dom';

export default class RectTool implements Tool<null, PointerEvent> {
  #unsubscribe: () => void = () => {};
  readonly id: string = constants.id;
  readonly name: string = constants.name;
  readonly hotkey: string | null = constants.hotkey;

  // NOTE: Maybe it is viable to create global counter for the viewport
  private static prevViewport: Viewport | null = null;
  private static counter: number = 0;

  getCursor(): string | null {
    // TODO: create custom cursor
    return null;
  }

  setOptions(options: null): void {}

  createCommand(
    viewport: Viewport,
    { triggerEvent, color }: ToolCreateCommandOptions<PointerEvent>
  ): RectCommand | null {
    // TODO: refactor
    if (RectTool.prevViewport !== viewport) {
      RectTool.counter = 0;
      RectTool.prevViewport = viewport;
    }
    const iterable = createPointerIterable(
      triggerEvent,
      viewport.container,
      viewport.offset
    );
    return new RectCommand(viewport.layers, iterable, {
      color,
      operation: 'fill',
      // TODO: it should be reused for other shape tools
      getLayerName: (baseName: string) => {
        let name = '';
        if (RectTool.counter > 0) {
          name = `${baseName} ${RectTool.counter}`;
        } else {
          name = baseName;
        }
        RectTool.counter++;
        return name;
      },
    });
  }

  destroy(): void {
    this.#unsubscribe();
  }
}
