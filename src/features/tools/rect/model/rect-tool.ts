import { RectCommand, Viewport } from '@rastrr-editor/core';
import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';
import * as constants from './constants';
import { createPointerIterable } from '~/shared/lib/dom';
import { generateDefaultName } from '~/shared/lib/strings';

export default class RectTool implements Tool<null, PointerEvent> {
  #unsubscribe: () => void = () => {};
  readonly id: string = constants.id;
  readonly name: string = constants.name;
  readonly hotkey: string | null = constants.hotkey;

  getCursor(): string | null {
    return 'crosshair';
  }

  setOptions(options: null): void {}

  createCommand(
    viewport: Viewport,
    { triggerEvent, color }: ToolCreateCommandOptions<PointerEvent>
  ): RectCommand | null {
    const iterable = createPointerIterable(
      triggerEvent,
      viewport.container,
      viewport.offset
    );
    return new RectCommand(viewport.layers, iterable, {
      color,
      operation: 'fill',
      // TODO: it should be reused for other shape tools
      getLayerName: (baseName: string) =>
        generateDefaultName(
          Array.from(viewport.layers).map(({ name }) => name),
          baseName
        ),
    });
  }

  destroy(): void {
    this.#unsubscribe();
  }
}
