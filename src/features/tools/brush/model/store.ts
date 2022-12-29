import { writable } from 'svelte/store';
import type { BrushOptions } from '../types';

export const options = writable<BrushOptions>({ size: 10, opacity: 1 });
