import { writable } from 'svelte/store';
import type { Tool } from '../types';

export const activeTool = writable<Tool<any, any> | null>(null);

const DEFAULT_CURSOR = 'url(/icons/cursor-default.svg)';

export const toolCursor = writable<string>(DEFAULT_CURSOR);

let prevTool: Tool<any, any> | null = null;

activeTool.subscribe(
  (tool) => {
    prevTool = tool;
    toolCursor.set(tool?.getCursor() ?? DEFAULT_CURSOR);
    // NOTE: there is a bug in svelte store - it doesn't pass previous value
  },
  () => {
    prevTool?.destroy();
  },
);
