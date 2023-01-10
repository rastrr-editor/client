import { writable } from 'svelte/store';
import type { EraserOptions } from '../types';

export const eraserOptionsStore = writable<EraserOptions>({ size: 10 });
