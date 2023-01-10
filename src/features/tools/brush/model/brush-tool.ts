import { type Viewport, BrushCommand } from '@rastrr-editor/core';

import { type ToolCreateCommandOptions, DrawLineTool } from '~/entities/tool';
import { createPointerIterable } from '~/shared/lib/dom';
import { options as defaultOptions } from './store';
import type { BrushOptions } from '../types';
import * as constants from './constants';

export default class EraserTool extends DrawLineTool<BrushOptions> {
  readonly id: string = constants.id;
  readonly name: string = constants.name;
  readonly hotkey: string = constants.hotkey;

  constructor(options?: BrushOptions) {
    super(options ?? defaultOptions);
  }

  createCommand(
    viewport: Viewport,
    { triggerEvent, color }: ToolCreateCommandOptions<PointerEvent>
  ): BrushCommand | null {
    if (!this.checkActiveLayerAvailability(viewport)) {
      return null;
    }

    const iterable = createPointerIterable(
      triggerEvent,
      viewport.container,
      viewport.offset
    );

    return new BrushCommand(viewport.layers, iterable, {
      color: color.clone().setOpacity(this.options.opacity),
      width: this.options.size,
    });
  }
}
