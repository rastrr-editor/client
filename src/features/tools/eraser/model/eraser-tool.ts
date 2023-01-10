import { type Viewport, EraserCommand } from '@rastrr-editor/core';

import { type ToolCreateCommandOptions, DrawLineTool } from '~/entities/tool';
import { createPointerIterable } from '~/shared/lib/dom';
import { options as defaultOptions } from './store';
import type { EraserOptions } from '../types';
import * as constants from './constants';

export default class EraserTool extends DrawLineTool<EraserOptions> {
  readonly id: string = constants.id;
  readonly name: string = constants.name;
  readonly hotkey: string = constants.hotkey;

  constructor(options?: EraserOptions) {
    super(options ?? defaultOptions);
  }

  createCommand(
    viewport: Viewport,
    { triggerEvent }: ToolCreateCommandOptions<PointerEvent>
  ): EraserCommand | null {
    if (!this.checkActiveLayerAvailability(viewport)) {
      return null;
    }

    const iterable = createPointerIterable(
      triggerEvent,
      viewport.container,
      viewport.offset
    );

    return new EraserCommand(viewport.layers, iterable, {
      width: this.options.size,
    });
  }
}
