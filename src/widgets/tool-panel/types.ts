import type { Component } from 'svelte';

import type { ShapeTool } from '~/entities/tool';

type ShapeToolConstructor = new () => ShapeTool;

type ToolConstants = {
  id: string;
  name: string;
  hotkey: string | null;
};

export type ShapeToolData = {
  icon: Component;
  tool: ShapeToolConstructor;
  constants: ToolConstants;
};

export type ToolTooltip = {
  show: boolean;
  trigger: HTMLButtonElement | null;
};
