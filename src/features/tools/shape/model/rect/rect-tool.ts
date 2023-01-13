import { RectCommand, Viewport } from '@rastrr-editor/core';

import { type ToolCreateCommandOptions, ShapeTool } from '~/entities/tool';
import * as constants from './constants';
import { createPointerIterable } from '~/shared/lib/dom';

export default class RectTool extends ShapeTool {
  readonly id: string = constants.id;
  readonly name: string = constants.name;
  readonly hotkey: string | null = constants.hotkey;

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
      getLayerName: this.createGetLayerName(viewport),
    });
  }
}
