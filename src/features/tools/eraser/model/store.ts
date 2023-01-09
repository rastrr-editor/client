import { writable } from 'svelte/store';
import type { EraserOptions } from '../types';

export const options = writable<EraserOptions>({ size: 10 });
