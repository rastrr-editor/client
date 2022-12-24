import { BrushCommand } from '@rastrr-editor/core';
import type { Tool } from '~/entities/tool';
import type { BrushOptions } from '../types';

export default class BrushTool implements Tool<BrushOptions> {
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
          stroke="#000"
        />
      </svg>`
    )}") ${this.#options.size / 2 + 1} ${this.#options.size / 2 + 1}`;
  }

  setOptions(options: BrushOptions): void {
    this.#options = options;
  }

  createCommand(
    ...args: ConstructorParameters<typeof BrushCommand>
  ): BrushCommand {
    return new BrushCommand(...args);
  }
}
