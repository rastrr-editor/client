import type { SvelteComponent } from 'svelte';

import type { ShapeTool } from '~/entities/tool';

type ShapeToolConstructor = new () => ShapeTool;

type ToolConstants = {
  id: string;
  name: string;
  hotkey: string | null;
};

export type ShapeToolData = {
  icon: typeof SvelteComponent<any>;
  tool: ShapeToolConstructor;
  constants: ToolConstants;
};

export type ToolTooltip = {
  show: boolean;
  trigger: HTMLButtonElement | null;
};
