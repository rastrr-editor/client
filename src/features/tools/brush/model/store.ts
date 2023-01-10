import { writable } from 'svelte/store';
import type { BrushOptions } from '../types';

export const brushOptionsStore = writable<BrushOptions>({
  size: 10,
  opacity: 1,
});
