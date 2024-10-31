import type { Command, Viewport } from '@rastrr-editor/core';

import type { Tool, ToolCreateCommandOptions } from '~/entities/tool';
import { generateDefaultName } from '~/shared/lib/strings';

export default abstract class ShapeTool implements Tool<null, PointerEvent> {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly hotkey: string | null;

  protected unsubscribe: () => void = () => {};

  getCursor(): string | null {
    return 'crosshair';
  }

  setOptions(options: null): void {}

  destroy(): void {
    this.unsubscribe();
  }

  createGetLayerName(viewport: Viewport) {
    return function (baseName: string): string {
      return generateDefaultName(
        Array.from(viewport.layers).map(({ name }) => name),
        baseName,
      );
    };
  }

  abstract createCommand(
    viewport: Viewport,
    { triggerEvent, color }: ToolCreateCommandOptions<PointerEvent>,
  ): Command | null;
}
